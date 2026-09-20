import { searchCompatibleDrivers } from '../src/services/matchingService';
import { seedDatabase } from '../src/config/seed';

describe('Deterministic Driver Matching Engine Tests', () => {
  beforeAll(async () => {
    await seedDatabase();
  });

  test('Calculates scores and sorts candidates by compatibility', () => {
    const results = searchCompatibleDrivers({
      pickupLat: 28.5355,
      pickupLng: 77.3910,
      transmission: 'AUTOMATIC',
      vehicleType: 'SUV',
      isNightTrip: true,
    });

    expect(results.length).toBeGreaterThan(0);
    const topDriver = results[0];
    expect(topDriver.compatibilityScore).toBeGreaterThan(70);
    expect(topDriver.reasons.length).toBeGreaterThanOrEqual(3);
    expect(topDriver.reasons[0]).toContain('km from pickup');
  });
});
