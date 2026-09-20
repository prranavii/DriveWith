import bcrypt from 'bcryptjs';
import { inMemoryStore } from './db';

export async function seedDatabase() {
  console.log('[Seed] Starting DriveWith database seeding...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Customers
  const customerList = [
    { id: 'c1010000-0000-0000-0000-000000000001', name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 9876543210', role: 'CUSTOMER' },
    { id: 'c1010000-0000-0000-0000-000000000002', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 9876543211', role: 'CUSTOMER' },
    { id: 'c1010000-0000-0000-0000-000000000003', name: 'Rohan Gupta', email: 'rohan@example.com', phone: '+91 9876543212', role: 'CUSTOMER' },
    { id: 'c1010000-0000-0000-0000-000000000004', name: 'Ananya Verma', email: 'ananya@example.com', phone: '+91 9876543213', role: 'CUSTOMER' },
    { id: 'c1010000-0000-0000-0000-000000000005', name: 'Vikram Malhotra', email: 'vikram@example.com', phone: '+91 9876543214', role: 'CUSTOMER' },
    { id: 'c1010000-0000-0000-0000-000000000006', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 9876543215', role: 'CUSTOMER' },
    { id: 'c1010000-0000-0000-0000-000000000007', name: 'Kabir Mehta', email: 'kabir@example.com', phone: '+91 9876543216', role: 'CUSTOMER' },
    { id: 'c1010000-0000-0000-0000-000000000008', name: 'Diya Joshi', email: 'diya@example.com', phone: '+91 9876543217', role: 'CUSTOMER' },
    { id: 'c1010000-0000-0000-0000-000000000009', name: 'Arjun Nair', email: 'arjun@example.com', phone: '+91 9876543218', role: 'CUSTOMER' },
    { id: 'c1010000-0000-0000-0000-000000000010', name: 'Meera Singh', email: 'meera@example.com', phone: '+91 9876543219', role: 'CUSTOMER' },
  ];

  // Admin user
  const adminUser = {
    id: 'a1010000-0000-0000-0000-000000000000',
    name: 'Platform Admin',
    email: 'admin@drivewith.ai',
    phone: '+91 9999999999',
    role: 'ADMIN',
    password_hash: passwordHash,
  };

  inMemoryStore.users = [adminUser, ...customerList.map(c => ({ ...c, password_hash: passwordHash }))];

  // 2. Vehicles
  inMemoryStore.vehicles = [
    { id: 'v201', customer_id: customerList[0].id, make: 'Honda', model: 'City', year: 2022, license_plate: 'UP16 AB 1234', transmission: 'AUTOMATIC', vehicle_type: 'SEDAN', color: 'White' },
    { id: 'v202', customer_id: customerList[0].id, make: 'Hyundai', model: 'Creta', year: 2023, license_plate: 'UP16 CD 5678', transmission: 'AUTOMATIC', vehicle_type: 'SUV', color: 'Black' },
    { id: 'v203', customer_id: customerList[1].id, make: 'Toyota', model: 'Fortuner', year: 2021, license_plate: 'DL3C EF 9012', transmission: 'AUTOMATIC', vehicle_type: 'SUV', color: 'Silver' },
    { id: 'v204', customer_id: customerList[1].id, make: 'Maruti', model: 'Swift', year: 2020, license_plate: 'DL8C GH 3456', transmission: 'MANUAL', vehicle_type: 'HATCHBACK', color: 'Red' },
    { id: 'v205', customer_id: customerList[2].id, make: 'BMW', model: '5 Series', year: 2023, license_plate: 'HR26 JK 7890', transmission: 'AUTOMATIC', vehicle_type: 'LUXURY', color: 'Blue' },
    { id: 'v206', customer_id: customerList[3].id, make: 'Kia', model: 'Seltos', year: 2022, license_plate: 'UP14 LM 2345', transmission: 'AUTOMATIC', vehicle_type: 'SUV', color: 'Grey' },
    { id: 'v207', customer_id: customerList[4].id, make: 'Mercedes-Benz', model: 'E-Class', year: 2024, license_plate: 'DL1A NP 6789', transmission: 'AUTOMATIC', vehicle_type: 'LUXURY', color: 'Black' },
    { id: 'v208', customer_id: customerList[5].id, make: 'Tata', model: 'Nexon EV', year: 2023, license_plate: 'HR10 QR 1122', transmission: 'AUTOMATIC', vehicle_type: 'SUV', color: 'Teal' },
    { id: 'v209', customer_id: customerList[6].id, make: 'Mahindra', model: 'XUV700', year: 2022, license_plate: 'UP16 ST 3344', transmission: 'MANUAL', vehicle_type: 'SUV', color: 'Midnight Blue' },
    { id: 'v210', customer_id: customerList[7].id, make: 'Volkswagen', model: 'Virtus', year: 2023, license_plate: 'DL9C UV 5566', transmission: 'AUTOMATIC', vehicle_type: 'SEDAN', color: 'Wild Cherry Red' },
    { id: 'v211', customer_id: customerList[8].id, make: 'Skoda', model: 'Slavia', year: 2022, license_plate: 'HR51 WX 7788', transmission: 'MANUAL', vehicle_type: 'SEDAN', color: 'Carbon Steel' },
    { id: 'v212', customer_id: customerList[9].id, make: 'Audi', model: 'A6', year: 2023, license_plate: 'DL3C YZ 9900', transmission: 'AUTOMATIC', vehicle_type: 'LUXURY', color: 'White' },
    { id: 'v213', customer_id: customerList[2].id, make: 'Toyota', model: 'Innova Crysta', year: 2021, license_plate: 'UP16 AA 1111', transmission: 'MANUAL', vehicle_type: 'SUV', color: 'Bronze' },
    { id: 'v214', customer_id: customerList[3].id, make: 'Hyundai', model: 'Verna', year: 2023, license_plate: 'DL8C BB 2222', transmission: 'AUTOMATIC', vehicle_type: 'SEDAN', color: 'Black' },
    { id: 'v215', customer_id: customerList[4].id, make: 'MG', model: 'Hector', year: 2022, license_plate: 'HR26 CC 3333', transmission: 'AUTOMATIC', vehicle_type: 'SUV', color: 'Aurora Silver' },
  ];

  // 3. Drivers (20 Drivers with unique skills, locations near NCR)
  const driverData = [
    { name: 'Rajesh Kumar', phone: '+91 9111111101', lat: 28.5355, lng: 77.3910, rating: 4.92, exp: 8, manual: true, auto: true, suv: true, sedan: true, luxury: true, night: true, highway: true, emergency: true, onTime: 98.4, cancel: 0.8, badge: 'PLATINUM_PRO' },
    { name: 'Suresh Verma', phone: '+91 9111111102', lat: 28.5400, lng: 77.3800, rating: 4.85, exp: 6, manual: true, auto: true, suv: true, sedan: true, luxury: false, night: true, highway: true, emergency: true, onTime: 96.2, cancel: 1.1, badge: 'GOLD_VETERAN' },
    { name: 'Amit Singh', phone: '+91 9111111103', lat: 28.5250, lng: 77.4000, rating: 4.78, exp: 4, manual: true, auto: true, suv: false, sedan: true, luxury: false, night: false, highway: true, emergency: false, onTime: 94.5, cancel: 2.1, badge: 'VERIFIED' },
    { name: 'Vikram Yadav', phone: '+91 9111111104', lat: 28.5500, lng: 77.3700, rating: 4.95, exp: 10, manual: true, auto: true, suv: true, sedan: true, luxury: true, night: true, highway: true, emergency: true, onTime: 99.1, cancel: 0.4, badge: 'MASTER_CHAUFFEUR' },
    { name: 'Ramesh Chand', phone: '+91 9111111105', lat: 28.5600, lng: 77.3500, rating: 4.88, exp: 7, manual: true, auto: true, suv: true, sedan: true, luxury: false, night: true, highway: true, emergency: true, onTime: 97.0, cancel: 1.0, badge: 'GOLD_VETERAN' },
    { name: 'Deepak Sharma', phone: '+91 9111111106', lat: 28.5100, lng: 77.4100, rating: 4.70, exp: 3, manual: false, auto: true, suv: false, sedan: true, luxury: false, night: false, highway: false, emergency: false, onTime: 92.8, cancel: 3.0, badge: 'VERIFIED' },
    { name: 'Manoj Tiwari', phone: '+91 9111111107', lat: 28.5300, lng: 77.3600, rating: 4.82, exp: 5, manual: true, auto: true, suv: true, sedan: true, luxury: false, night: true, highway: true, emergency: true, onTime: 95.8, cancel: 1.4, badge: 'SILVER_STAR' },
    { name: 'Sunil Prasad', phone: '+91 9111111108', lat: 28.5700, lng: 77.3400, rating: 4.90, exp: 9, manual: true, auto: true, suv: true, sedan: true, luxury: true, night: true, highway: true, emergency: true, onTime: 98.0, cancel: 0.7, badge: 'PLATINUM_PRO' },
    { name: 'Dharmendra Pal', phone: '+91 9111111109', lat: 28.5200, lng: 77.3900, rating: 4.65, exp: 2, manual: true, auto: false, suv: false, sedan: true, luxury: false, night: false, highway: true, emergency: false, onTime: 91.5, cancel: 3.5, badge: 'VERIFIED' },
    { name: 'Praveen Gupta', phone: '+91 9111111110', lat: 28.5450, lng: 77.3950, rating: 4.87, exp: 6, manual: true, auto: true, suv: true, sedan: true, luxury: true, night: true, highway: true, emergency: true, onTime: 96.8, cancel: 1.2, badge: 'GOLD_VETERAN' },
    { name: 'Sanjay Rawat', phone: '+91 9111111111', lat: 28.5380, lng: 77.3850, rating: 4.79, exp: 4, manual: true, auto: true, suv: true, sedan: true, luxury: false, night: true, highway: true, emergency: false, onTime: 95.0, cancel: 1.8, badge: 'SILVER_STAR' },
    { name: 'Gaurav Joshi', phone: '+91 9111111112', lat: 28.5150, lng: 77.4200, rating: 4.91, exp: 8, manual: true, auto: true, suv: true, sedan: true, luxury: true, night: true, highway: true, emergency: true, onTime: 98.2, cancel: 0.6, badge: 'PLATINUM_PRO' },
    { name: 'Nitin Chaudhry', phone: '+91 9111111113', lat: 28.5550, lng: 77.3650, rating: 4.73, exp: 3, manual: true, auto: true, suv: false, sedan: true, luxury: false, night: false, highway: true, emergency: true, onTime: 93.0, cancel: 2.5, badge: 'VERIFIED' },
    { name: 'Harish Kumar', phone: '+91 9111111114', lat: 28.5320, lng: 77.3750, rating: 4.86, exp: 7, manual: true, auto: true, suv: true, sedan: true, luxury: true, night: true, highway: true, emergency: true, onTime: 96.5, cancel: 1.0, badge: 'GOLD_VETERAN' },
    { name: 'Vinod Saxena', phone: '+91 9111111115', lat: 28.5480, lng: 77.3820, rating: 4.94, exp: 11, manual: true, auto: true, suv: true, sedan: true, luxury: true, night: true, highway: true, emergency: true, onTime: 99.0, cancel: 0.3, badge: 'MASTER_CHAUFFEUR' },
    { name: 'Alok Mishr', phone: '+91 9111111116', lat: 28.5050, lng: 77.4050, rating: 4.68, exp: 2, manual: false, auto: true, suv: false, sedan: true, luxury: false, night: false, highway: false, emergency: false, onTime: 91.0, cancel: 3.8, badge: 'VERIFIED' },
    { name: 'Kamal Kishor', phone: '+91 9111111117', lat: 28.5620, lng: 77.3480, rating: 4.81, exp: 5, manual: true, auto: true, suv: true, sedan: true, luxury: false, night: true, highway: true, emergency: true, onTime: 95.5, cancel: 1.5, badge: 'SILVER_STAR' },
    { name: 'Pankaj Bhatia', phone: '+91 9111111118', lat: 28.5280, lng: 77.3980, rating: 4.89, exp: 8, manual: true, auto: true, suv: true, sedan: true, luxury: true, night: true, highway: true, emergency: true, onTime: 97.8, cancel: 0.9, badge: 'PLATINUM_PRO' },
    { name: 'Tarun Saxena', phone: '+91 9111111119', lat: 28.5360, lng: 77.3890, rating: 4.76, exp: 4, manual: true, auto: true, suv: false, sedan: true, luxury: false, night: true, highway: true, emergency: false, onTime: 94.2, cancel: 2.0, badge: 'SILVER_STAR' },
    { name: 'Jitendra Saini', phone: '+91 9111111120', lat: 28.5420, lng: 77.3780, rating: 4.93, exp: 9, manual: true, auto: true, suv: true, sedan: true, luxury: true, night: true, highway: true, emergency: true, onTime: 98.7, cancel: 0.5, badge: 'PLATINUM_PRO' },
  ];

  driverData.forEach((d, idx) => {
    const userId = `d1010000-0000-0000-0000-${(idx + 1).toString().padStart(12, '0')}`;
    const driverId = `drv00000-0000-0000-0000-${(idx + 1).toString().padStart(12, '0')}`;

    const userObj = {
      id: userId,
      name: d.name,
      email: `driver${idx + 1}@drivewith.ai`,
      phone: d.phone,
      role: 'DRIVER',
      password_hash: passwordHash,
    };
    inMemoryStore.users.push(userObj);

    const driverObj = {
      id: driverId,
      user_id: userId,
      license_number: `DL-142020${(1000 + idx).toString()}`,
      verification_status: 'VERIFIED',
      is_online: true,
      current_lat: d.lat,
      current_lng: d.lng,
      rating: d.rating,
      total_trips: 45 + idx * 12,
    };
    inMemoryStore.drivers.push(driverObj);

    const skillsObj = {
      id: `sk000000-0000-0000-0000-${(idx + 1).toString().padStart(12, '0')}`,
      driver_id: driverId,
      years_experience: d.exp,
      transmission_manual: d.manual,
      transmission_auto: d.auto,
      sedan_exp: d.sedan,
      suv_exp: d.suv,
      luxury_exp: d.luxury,
      night_driving_exp: d.night,
      highway_exp: d.highway,
      emergency_exp: d.emergency,
      on_time_percentage: d.onTime,
      cancellation_rate: d.cancel,
      badge: d.badge,
    };
    inMemoryStore.driver_skills.push(skillsObj);
  });

  // Initial Sample Agent Logs for Admin View
  inMemoryStore.agent_logs = [
    {
      id: 'log-001',
      agent_name: 'Concierge Agent',
      action_name: 'EXACTED_BOOKING_INTENT',
      details: { pickup: 'Sector 62 Noida', destination: 'DLF Cyber City Gurgaon', vehicle_type: 'SEDAN', transmission: 'AUTOMATIC' },
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'log-002',
      agent_name: 'Matching Agent',
      action_name: 'SEARCHED_CANDIDATES',
      details: { candidates_found: 5, top_score: 94.8, selected_driver: 'Rajesh Kumar' },
      created_at: new Date(Date.now() - 3500000).toISOString(),
    },
    {
      id: 'log-003',
      agent_name: 'Matching Agent',
      action_name: 'EXPLAINED_SELECTION',
      details: { reasons: ['2.1 km from pickup', 'Experienced with Automatic SUVs', '98.4% on-time rate', '4.92 Rating'] },
      created_at: new Date(Date.now() - 3400000).toISOString(),
    },
    {
      id: 'log-004',
      agent_name: 'Safety Agent',
      action_name: 'MONITORED_ROUTE_TELEMETRY',
      details: { status: 'NORMAL', speed_kmh: 42, deviation_meters: 15 },
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  console.log(`[Seed] Database successfully seeded: ${inMemoryStore.users.length} Users, ${inMemoryStore.drivers.length} Drivers with Skill Passports, ${inMemoryStore.vehicles.length} Vehicles.`);
}
