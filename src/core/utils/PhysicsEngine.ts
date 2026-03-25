/**
 * PhysicsEngine.ts
 * Procesa datos crudos del ESP32 para obtener métricas biomecánicas (Salto, RSI, etc.)
 */

export const PhysicsEngine = {
  // Constante de gravedad
  G: 9.80665,

  /**
   * Calcula la altura de un salto basado en el tiempo de vuelo (Flight Time).
   * Fórmula: h = (g * t^2) / 8
   */
  calculateJumpHeight(flightTimeSeconds: number): number {
    if (flightTimeSeconds <= 0) return 0;
    const height = (this.G * Math.pow(flightTimeSeconds, 2)) / 8;
    return Number(height.toFixed(3)); // Retorna en metros
  },

  /**
   * Calcula la velocidad inicial (V0) de un salto.
   * Fórmula: v = (g * t) / 2
   */
  calculateInitialVelocity(flightTimeSeconds: number): number {
    if (flightTimeSeconds <= 0) return 0;
    const velocity = (this.G * flightTimeSeconds) / 2;
    return Number(velocity.toFixed(3)); // Retorna en m/s
  },

  /**
   * Calcula el Reactive Strength Index (RSI).
   * Fórmula: RSI = Tiempo de Vuelo / Tiempo de Contacto
   */
  calculateRSI(flightTimeSeconds: number, contactTimeSeconds: number): number {
    if (contactTimeSeconds <= 0) return 0;
    const rsi = flightTimeSeconds / contactTimeSeconds;
    return Number(rsi.toFixed(2));
  },

  /**
   * Calcula la potencia relativa estimativa (Sayers Formula - simplificada para app)
   * Peak Power (W) = 60.7 * JumpHeight(cm) + 45.3 * Weight(kg) - 2055
   */
  calculatePeakPower(jumpHeightCm: number, weightKg: number): number {
    if (jumpHeightCm <= 0 || weightKg <= 0) return 0;
    const power = (60.7 * jumpHeightCm) + (45.3 * weightKg) - 2055;
    return Math.max(0, Number(power.toFixed(1)));
  }
};
