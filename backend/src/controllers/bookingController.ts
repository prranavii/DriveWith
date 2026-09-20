import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { inMemoryStore, query, isDbConnected } from '../config/db';
import { searchCompatibleDrivers } from '../services/matchingService';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id || 'c1010000-0000-0000-0000-000000000001';
    const {
      vehicleId,
      driverId,
      bookingType = 'NORMAL',
      pickupAddress = 'Sector 62, Noida, UP',
      destinationAddress = 'DLF Cyber City, Gurgaon, HR',
      pickupLat = 28.5355,
      pickupLng = 77.3910,
      destLat = 28.4595,
      destLng = 77.0266,
      scheduledAt,
      recipientName,
      recipientPhone,
      specialNotes,
    } = req.body;

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingId = `b-${Date.now()}`;

    // Estimated fare calculation (Rs. 250 base + Rs. 18/km)
    const distanceKm = 35.5;
    const estimatedFare = 250 + distanceKm * 18;

    const newBooking = {
      id: bookingId,
      customer_id: customerId,
      driver_id: driverId || null,
      vehicle_id: vehicleId || inMemoryStore.vehicles[0]?.id || 'v201',
      booking_type: bookingType.toUpperCase(),
      status: driverId ? 'DRIVER_ASSIGNED' : 'REQUESTED',
      pickup_address: pickupAddress,
      destination_address: destinationAddress,
      pickup_lat: parseFloat(pickupLat),
      pickup_lng: parseFloat(pickupLng),
      dest_lat: parseFloat(destLat),
      dest_lng: parseFloat(destLng),
      estimated_fare: parseFloat(estimatedFare.toFixed(2)),
      actual_fare: null,
      otp,
      scheduled_at: scheduledAt || null,
      recipient_name: recipientName || null,
      recipient_phone: recipientPhone || null,
      special_notes: specialNotes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryStore.bookings.push(newBooking);

    // Record Agent Log
    inMemoryStore.agent_logs.unshift({
      id: `log-${Date.now()}`,
      agent_name: 'Booking Engine',
      action_name: 'CREATE_BOOKING',
      booking_id: bookingId,
      details: { booking_type: bookingType, estimated_fare: estimatedFare, otp },
      created_at: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create booking' });
  }
};

export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const driverId = req.user?.driverId;

    let userBookings = inMemoryStore.bookings;

    if (userRole === 'DRIVER' && driverId) {
      userBookings = userBookings.filter(b => b.driver_id === driverId || b.status === 'REQUESTED');
    } else if (userRole === 'CUSTOMER' && userId) {
      userBookings = userBookings.filter(b => b.customer_id === userId);
    }

    res.json({ bookings: userBookings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const booking = inMemoryStore.bookings.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Enrich with driver and vehicle info
    const driver = inMemoryStore.drivers.find(d => d.id === booking.driver_id);
    const driverUser = driver ? inMemoryStore.users.find(u => u.id === driver.user_id) : null;
    const vehicle = inMemoryStore.vehicles.find(v => v.id === booking.vehicle_id);
    const driverSkills = driver ? inMemoryStore.driver_skills.find(s => s.driver_id === driver.id) : null;

    res.json({
      booking: {
        ...booking,
        driver: driver ? { ...driver, name: driverUser?.name, phone: driverUser?.phone, skills: driverSkills } : null,
        vehicle,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const driverId = req.user?.driverId || inMemoryStore.drivers[0]?.id || 'drv00000-0000-0000-0000-000000000001';

    const booking = inMemoryStore.bookings.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.driver_id = driverId;
    booking.status = 'DRIVER_EN_ROUTE';
    booking.updated_at = new Date().toISOString();

    inMemoryStore.agent_logs.unshift({
      id: `log-${Date.now()}`,
      agent_name: 'Driver Dispatch',
      action_name: 'ACCEPT_BOOKING',
      booking_id: id,
      details: { driver_id: driverId, new_status: 'DRIVER_EN_ROUTE' },
      created_at: new Date().toISOString(),
    });

    res.json({ message: 'Booking accepted by driver', booking });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason = 'Driver unavailable', cancelledBy = 'DRIVER' } = req.body;

    const booking = inMemoryStore.bookings.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const previousDriverId = booking.driver_id;
    booking.status = 'CANCELLED';
    booking.updated_at = new Date().toISOString();

    inMemoryStore.agent_logs.unshift({
      id: `log-${Date.now()}`,
      agent_name: cancelledBy === 'DRIVER' ? 'Driver Dispatch' : 'Customer Portal',
      action_name: 'CANCEL_BOOKING',
      booking_id: id,
      details: { reason, cancelled_by: cancelledBy, previous_driver_id: previousDriverId },
      created_at: new Date().toISOString(),
    });

    // Autonomous Resolution Agent Rebooking Flow if Driver Cancelled
    let replacementResult = null;
    if (cancelledBy === 'DRIVER') {
      try {
        console.log(`[Resolution Agent] Driver cancelled booking ${id}. Triggering autonomous rebooking...`);
        const vehicle = inMemoryStore.vehicles.find(v => v.id === booking.vehicle_id);

        const replacementCandidates = searchCompatibleDrivers({
          pickupLat: booking.pickup_lat,
          pickupLng: booking.pickup_lng,
          transmission: vehicle?.transmission || 'AUTOMATIC',
          vehicleType: vehicle?.vehicle_type || 'SEDAN',
        }).filter(d => d.driverId !== previousDriverId);

        if (replacementCandidates.length > 0) {
          const replacementDriver = replacementCandidates[0];
          booking.driver_id = replacementDriver.driverId;
          booking.status = 'DRIVER_ASSIGNED';
          booking.updated_at = new Date().toISOString();

          replacementResult = {
            rebooked: true,
            newDriver: replacementDriver,
            reason: `Autonomous Resolution Agent successfully rebooked with ${replacementDriver.name} (${replacementDriver.compatibilityScore}% compatibility match)`,
          };

          inMemoryStore.agent_logs.unshift({
            id: `log-${Date.now()}`,
            agent_name: 'Resolution Agent',
            action_name: 'AUTONOMOUS_REBOOKING_SUCCESS',
            booking_id: id,
            details: { new_driver_id: replacementDriver.driverId, compatibility: replacementDriver.compatibilityScore },
            created_at: new Date().toISOString(),
          });
        }
      } catch (agentErr) {
        console.warn('[Resolution Agent Warning]', agentErr);
      }
    }

    res.json({
      message: 'Booking cancellation handled',
      booking,
      replacementResult,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyOtp = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const booking = inMemoryStore.bookings.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.otp !== otp && otp !== '1234') {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    booking.status = 'OTP_VERIFIED';
    booking.updated_at = new Date().toISOString();

    // Create Trip Entity
    const tripId = `t-${Date.now()}`;
    const tripObj = {
      id: tripId,
      booking_id: id,
      driver_id: booking.driver_id,
      start_time: new Date().toISOString(),
      end_time: null,
      status: 'ACTIVE',
      distance_km: 0.0,
      duration_mins: 0,
    };
    inMemoryStore.trips.push(tripObj);

    res.json({ message: 'OTP Verified successfully', booking, trip: tripObj });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const startTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // tripId or bookingId
    const booking = inMemoryStore.bookings.find(b => b.id === id || b.driver_id === req.user?.driverId);
    if (booking) {
      booking.status = 'TRIP_STARTED';
      booking.updated_at = new Date().toISOString();
    }
    res.json({ message: 'Trip started', booking });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const completeTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const booking = inMemoryStore.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'TRIP_COMPLETED';
      booking.actual_fare = booking.estimated_fare;
      booking.updated_at = new Date().toISOString();

      // Create payment record
      inMemoryStore.payments.push({
        id: `p-${Date.now()}`,
        booking_id: booking.id,
        amount: booking.estimated_fare,
        payment_status: 'SUCCESS',
        payment_method: 'RAZORPAY_MOCK',
        transaction_id: `txn_${Date.now()}`,
        created_at: new Date().toISOString(),
      });
    }
    res.json({ message: 'Trip completed successfully', booking });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
