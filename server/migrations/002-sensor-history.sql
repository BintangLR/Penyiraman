-- Safe, additive migration. Existing rows are preserved.
ALTER TABLE moisture_history ADD COLUMN IF NOT EXISTS measured_at DATETIME(3) NULL AFTER value;

CREATE TABLE IF NOT EXISTS temperature_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zone_id INT NOT NULL,
  value DECIMAL(6,2) NOT NULL,
  measured_at DATETIME(3) NOT NULL,
  INDEX ix_temperature_history_zone_time (zone_id, measured_at),
  FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE
);
