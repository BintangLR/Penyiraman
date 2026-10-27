-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: irigasi_cerdas
-- ------------------------------------------------------
-- Server version	10.11.16-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `irigasi_cerdas`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `irigasi_cerdas` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `irigasi_cerdas`;

--
-- Table structure for table `app_data`
--

DROP TABLE IF EXISTS `app_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_data` (
  `data_key` varchar(40) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  PRIMARY KEY (`data_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_data`
--

LOCK TABLES `app_data` WRITE;
/*!40000 ALTER TABLE `app_data` DISABLE KEYS */;
INSERT INTO `app_data` VALUES ('graphics','{\"AVG_MOISTURE\":[53,54,56,55,56,54,55],\"DATA_TYPE_OPTIONS\":[{\"value\":\"moisture\",\"label\":\"Kelembapan Tanah\"},{\"value\":\"temperature\",\"label\":\"Suhu Tanah\"},{\"value\":\"watering\",\"label\":\"Penyiraman\"}],\"DAYS_7\":[\"14 Sep\",\"15 Sep\",\"16 Sep\",\"17 Sep\",\"18 Sep\",\"19 Sep\",\"20 Sep\"],\"DISTRIBUTION_DATA\":[{\"label\":\"Zona Kering\",\"count\":2,\"pct\":22,\"color\":\"#e55353\"},{\"label\":\"Zona Normal\",\"count\":5,\"pct\":56,\"color\":\"#10a67a\"},{\"label\":\"Zona Basah\",\"count\":2,\"pct\":22,\"color\":\"#2878d6\"}],\"KPI_DATA\":[{\"id\":\"humidity\",\"icon\":\"💧\",\"label\":\"Rata-rata Kelembapan\",\"value\":\"56%\",\"change\":\"+12%\",\"up\":true,\"sub\":\"Dari minggu lalu\"},{\"id\":\"watering\",\"icon\":\"🚿\",\"label\":\"Total Penyiraman\",\"value\":\"28 kali\",\"change\":\"+4\",\"up\":true,\"sub\":\"Dari minggu lalu\"},{\"id\":\"water\",\"icon\":\"🪣\",\"label\":\"Total Air Digunakan\",\"value\":\"340 Liter\",\"change\":\"+12%\",\"up\":true,\"sub\":\"Dari minggu lalu\"},{\"id\":\"duration\",\"icon\":\"⏱\",\"label\":\"Durasi Penyiraman\",\"value\":\"280 menit\",\"change\":\"-8%\",\"up\":false,\"sub\":\"Dari minggu lalu\"}],\"MOISTURE_HISTORY\":[{\"zoneId\":1,\"label\":\"Zona 1\",\"data\":[42,40,44,39,38,37,38]},{\"zoneId\":2,\"label\":\"Zona 2\",\"data\":[58,61,63,65,62,60,62]},{\"zoneId\":3,\"label\":\"Zona 3\",\"data\":[40,38,37,36,35,34,35]},{\"zoneId\":4,\"label\":\"Zona 4\",\"data\":[52,55,57,56,58,57,58]},{\"zoneId\":5,\"label\":\"Zona 5\",\"data\":[62,64,66,65,67,65,66]},{\"zoneId\":6,\"label\":\"Zona 6\",\"data\":[68,70,73,72,74,71,72]},{\"zoneId\":7,\"label\":\"Zona 7\",\"data\":[50,53,55,54,56,54,55]},{\"zoneId\":8,\"label\":\"Zona 8\",\"data\":[46,48,50,49,50,48,49]},{\"zoneId\":9,\"label\":\"Zona 9\",\"data\":[57,59,62,61,63,60,61]}],\"PERIOD_OPTIONS\":[{\"value\":\"7d\",\"label\":\"7 Hari Terakhir\"},{\"value\":\"14d\",\"label\":\"14 Hari Terakhir\"},{\"value\":\"30d\",\"label\":\"30 Hari Terakhir\"},{\"value\":\"90d\",\"label\":\"3 Bulan Terakhir\"}],\"TEMPERATURE_DATA\":{\"labels\":[\"14 Sep\",\"15 Sep\",\"16 Sep\",\"17 Sep\",\"18 Sep\",\"19 Sep\",\"20 Sep\"],\"values\":[24,28,31,32,27,28,29]},\"WATERING_DATA\":{\"labels\":[\"14 Sep\",\"15 Sep\",\"16 Sep\",\"17 Sep\",\"18 Sep\",\"19 Sep\",\"20 Sep\"],\"count\":[5,3,6,4,5,3,2],\"duration\":[55,35,70,45,60,35,25]},\"WATERING_HISTORY\":[{\"datetime\":\"20 Sep 2025 08:15\",\"zone\":\"Zona 1\",\"plant\":\"Kopi\",\"moistureBefore\":\"35%\",\"duration\":\"10 menit\",\"volume\":\"12 Liter\",\"status\":\"Selesai\"},{\"datetime\":\"20 Sep 2025 06:30\",\"zone\":\"Zona 3\",\"plant\":\"Tomat\",\"moistureBefore\":\"33%\",\"duration\":\"15 menit\",\"volume\":\"15 Liter\",\"status\":\"Selesai\"},{\"datetime\":\"19 Sep 2025 17:20\",\"zone\":\"Zona 6\",\"plant\":\"Terong\",\"moistureBefore\":\"45%\",\"duration\":\"10 menit\",\"volume\":\"14 Liter\",\"status\":\"Selesai\"},{\"datetime\":\"19 Sep 2025 15:10\",\"zone\":\"Zona 2\",\"plant\":\"Cabai\",\"moistureBefore\":\"42%\",\"duration\":\"8 menit\",\"volume\":\"10 Liter\",\"status\":\"Selesai\"},{\"datetime\":\"19 Sep 2025 06:40\",\"zone\":\"Zona 7\",\"plant\":\"Kubis\",\"moistureBefore\":\"38%\",\"duration\":\"10 menit\",\"volume\":\"12 Liter\",\"status\":\"Selesai\"},{\"datetime\":\"18 Sep 2025 08:00\",\"zone\":\"Zona 1\",\"plant\":\"Kopi\",\"moistureBefore\":\"34%\",\"duration\":\"12 menit\",\"volume\":\"13 Liter\",\"status\":\"Selesai\"},{\"datetime\":\"18 Sep 2025 07:15\",\"zone\":\"Zona 3\",\"plant\":\"Tomat\",\"moistureBefore\":\"32%\",\"duration\":\"14 menit\",\"volume\":\"16 Liter\",\"status\":\"Selesai\"}],\"ZONES_SUMMARY\":[{\"id\":1,\"name\":\"Zona 1\",\"plant\":\"Kopi\",\"moisture\":38,\"status\":\"Kering\",\"image\":\"https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&q=70\"},{\"id\":2,\"name\":\"Zona 2\",\"plant\":\"Cabai\",\"moisture\":62,\"status\":\"Normal\",\"image\":\"https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=80&q=70\"},{\"id\":3,\"name\":\"Zona 3\",\"plant\":\"Tomat\",\"moisture\":35,\"status\":\"Kering\",\"image\":\"https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=70\"},{\"id\":4,\"name\":\"Zona 4\",\"plant\":\"Sawi\",\"moisture\":58,\"status\":\"Normal\",\"image\":\"https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=80&q=70\"},{\"id\":5,\"name\":\"Zona 5\",\"plant\":\"Selada\",\"moisture\":66,\"status\":\"Normal\",\"image\":\"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=70\"},{\"id\":6,\"name\":\"Zona 6\",\"plant\":\"Terong\",\"moisture\":72,\"status\":\"Basah\",\"image\":\"https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=80&q=70\"},{\"id\":7,\"name\":\"Zona 7\",\"plant\":\"Kubis\",\"moisture\":55,\"status\":\"Normal\",\"image\":\"https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=80&q=70\"},{\"id\":8,\"name\":\"Zona 8\",\"plant\":\"Wortel\",\"moisture\":49,\"status\":\"Normal\",\"image\":\"https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&q=70\"},{\"id\":9,\"name\":\"Zona 9\",\"plant\":\"Kentang\",\"moisture\":61,\"status\":\"Normal\",\"image\":\"https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&q=70\"}],\"ZONE_OPTIONS\":[{\"value\":\"all\",\"label\":\"Semua Zona (1–9)\"},{\"value\":\"1\",\"label\":\"Zona 1\"},{\"value\":\"2\",\"label\":\"Zona 2\"},{\"value\":\"3\",\"label\":\"Zona 3\"},{\"value\":\"4\",\"label\":\"Zona 4\"},{\"value\":\"5\",\"label\":\"Zona 5\"},{\"value\":\"6\",\"label\":\"Zona 6\"},{\"value\":\"7\",\"label\":\"Zona 7\"},{\"value\":\"8\",\"label\":\"Zona 8\"},{\"value\":\"9\",\"label\":\"Zona 9\"}]}'),('settings','{\"account\":{\"name\":\"Michael Sonda\",\"email\":\"admin@irigasicerdas.id\",\"password\":\"••••••••••••\"},\"system\":{\"language\":\"Bahasa Indonesia\",\"timezone\":\"WITA (UTC+8)\",\"theme\":\"Terang\",\"autoRefresh\":\"5 menit\"},\"watering\":{\"defaultDuration\":\"5 menit\",\"flowRate\":\"1.2 Liter/menit\",\"moistureMin\":30,\"moistureOptimal\":70},\"notifs\":{\"lowMoisture\":true,\"wateringDone\":true,\"deviceOffline\":true,\"highWater\":true,\"skipSched\":true}}');
/*!40000 ALTER TABLE `app_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `event_date` varchar(30) DEFAULT NULL,
  `time_text` varchar(10) DEFAULT NULL,
  `zone_id` int(11) DEFAULT NULL,
  `zone_name` varchar(100) DEFAULT NULL,
  `plant` varchar(100) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `moisture_before` decimal(6,2) DEFAULT NULL,
  `moisture_after` decimal(6,2) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `water_volume` decimal(8,2) DEFAULT NULL,
  `method` varchar(30) DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  `started_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` VALUES (1,'20 Sep 2025','08:15',1,'Zona 1','Kopi','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=60&q=70',35.00,62.00,10,12.00,'Otomatis','Selesai',NULL),(2,'20 Sep 2025','06:30',3,'Zona 3','Tomat','https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=60&q=70',33.00,61.00,10,15.00,'Otomatis','Selesai',NULL),(3,'19 Sep 2025','17:20',6,'Zona 6','Terong','https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=60&q=70',45.00,68.00,10,14.00,'Otomatis','Selesai',NULL),(4,'19 Sep 2025','15:10',2,'Zona 2','Cabai','https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=60&q=70',42.00,64.00,8,10.00,'Manual','Selesai',NULL),(5,'19 Sep 2025','06:40',7,'Zona 7','Kubis','https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=60&q=70',38.00,60.00,10,12.00,'Otomatis','Selesai',NULL),(6,'18 Sep 2025','18:25',5,'Zona 5','Selada','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=60&q=70',40.00,65.00,10,13.00,'Otomatis','Selesai',NULL),(7,'18 Sep 2025','07:10',4,'Zona 4','Sawi','https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=60&q=70',36.00,58.00,8,10.00,'Manual','Selesai',NULL),(8,'17 Sep 2025','16:05',8,'Zona 8','Wortel','https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=60&q=70',48.00,66.00,10,15.00,'Otomatis','Selesai',NULL),(9,'17 Sep 2025','06:20',9,'Zona 9','Kentang','https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=60&q=70',44.00,63.00,10,12.00,'Otomatis','Selesai',NULL),(10,'16 Sep 2025','17:45',1,'Zona 1','Kopi','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=60&q=70',37.00,60.00,10,12.00,'Otomatis','Selesai',NULL),(11,'16 Sep 2025','08:00',3,'Zona 3','Tomat','https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=60&q=70',34.00,62.00,12,16.00,'Otomatis','Selesai',NULL),(12,'15 Sep 2025','17:30',6,'Zona 6','Terong','https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=60&q=70',43.00,67.00,10,14.00,'Otomatis','Selesai',NULL),(13,'15 Sep 2025','07:15',2,'Zona 2','Cabai','https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=60&q=70',40.00,63.00,9,11.00,'Manual','Selesai',NULL),(14,'14 Sep 2025','16:50',5,'Zona 5','Selada','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=60&q=70',38.00,62.00,10,13.00,'Otomatis','Selesai',NULL),(15,'14 Sep 2025','08:30',7,'Zona 7','Kubis','https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=60&q=70',35.00,59.00,10,12.00,'Otomatis','Selesai',NULL),(16,'13 Sep 2025','17:00',4,'Zona 4','Sawi','https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=60&q=70',37.00,57.00,8,9.00,'Manual','Selesai',NULL),(17,'13 Sep 2025','07:40',8,'Zona 8','Wortel','https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=60&q=70',46.00,64.00,10,14.00,'Otomatis','Selesai',NULL),(18,'12 Sep 2025','18:10',9,'Zona 9','Kentang','https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=60&q=70',42.00,62.00,11,13.00,'Otomatis','Selesai',NULL),(19,'12 Sep 2025','08:20',1,'Zona 1','Kopi','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=60&q=70',33.00,61.00,10,12.00,'Otomatis','Selesai',NULL),(20,'11 Sep 2025','17:55',3,'Zona 3','Tomat','https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=60&q=70',32.00,60.00,12,15.00,'Otomatis','Selesai',NULL),(21,'11 Sep 2025','07:00',2,'Zona 2','Cabai','https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=60&q=70',44.00,65.00,8,10.00,'Manual','Dibatalkan',NULL),(22,'10 Sep 2025','16:30',6,'Zona 6','Terong','https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=60&q=70',41.00,66.00,10,14.00,'Otomatis','Selesai',NULL),(23,'10 Sep 2025','08:45',5,'Zona 5','Selada','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=60&q=70',36.00,61.00,10,13.00,'Otomatis','Selesai',NULL),(24,'09 Sep 2025','17:10',7,'Zona 7','Kubis','https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=60&q=70',39.00,60.00,9,11.00,'Otomatis','Gagal',NULL),(25,'09 Sep 2025','07:20',4,'Zona 4','Sawi','https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=60&q=70',35.00,56.00,8,9.00,'Manual','Selesai',NULL),(26,'08 Sep 2025','17:40',8,'Zona 8','Wortel','https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=60&q=70',47.00,65.00,10,14.00,'Otomatis','Selesai',NULL),(27,'08 Sep 2025','08:55',9,'Zona 9','Kentang','https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=60&q=70',43.00,63.00,11,13.00,'Otomatis','Selesai',NULL),(28,'07 Sep 2025','16:15',1,'Zona 1','Kopi','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=60&q=70',34.00,60.00,10,12.00,'Otomatis','Berjalan',NULL),(29,'07 Sep 2025','07:30',3,'Zona 3','Tomat','https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=60&q=70',31.00,59.00,13,16.00,'Otomatis','Selesai',NULL),(30,'06 Sep 2025','18:00',6,'Zona 6','Terong','https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=60&q=70',40.00,65.00,10,14.00,'Otomatis','Selesai',NULL),(31,'27 Okt 2026','11.30',1,'Zona 1','Kopi','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',38.00,38.00,10,12.00,'Manual','Selesai',NULL),(32,'27 Okt 2026','11.42',1,'Zona 1','Kopi','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',38.00,38.00,10,12.00,'Manual','Selesai',NULL),(33,'27 Okt 2026','11.43',1,'Zona 1','Kopi','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',38.00,38.00,10,12.00,'Manual','Selesai',NULL),(34,'27 Okt 2026','11.48',1,'Zona 1','Kopi','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',38.00,38.00,1,1.20,'Manual','Selesai','2026-10-27 11:48:13'),(35,'27 Okt 2026','11.50',1,'Zona 1','Kopi','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',38.00,38.00,10,12.00,'Manual','Selesai',NULL),(36,'27 Okt 2026','11.50',3,'Zona 3','Tomat','https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&q=80',35.00,35.00,15,18.00,'Manual','Selesai',NULL),(37,'27 Okt 2026','11.54',1,'Zona 1','Kopi','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',38.00,38.00,10,12.00,'Manual','Selesai',NULL);
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `moisture_history`
--

DROP TABLE IF EXISTS `moisture_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `moisture_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `zone_id` int(11) NOT NULL,
  `day_index` int(11) NOT NULL,
  `value` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `zone_id` (`zone_id`),
  CONSTRAINT `moisture_history_ibfk_1` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moisture_history`
--

LOCK TABLES `moisture_history` WRITE;
/*!40000 ALTER TABLE `moisture_history` DISABLE KEYS */;
INSERT INTO `moisture_history` VALUES (1,1,0,42.00),(2,1,1,39.00),(3,1,2,46.00),(4,1,3,38.00),(5,1,4,41.00),(6,1,5,35.00),(7,1,6,38.00),(8,2,0,58.00),(9,2,1,61.00),(10,2,2,64.00),(11,2,3,59.00),(12,2,4,63.00),(13,2,5,65.00),(14,2,6,62.00),(15,3,0,45.00),(16,3,1,40.00),(17,3,2,38.00),(18,3,3,42.00),(19,3,4,36.00),(20,3,5,37.00),(21,3,6,35.00),(22,4,0,52.00),(23,4,1,55.00),(24,4,2,57.00),(25,4,3,53.00),(26,4,4,59.00),(27,4,5,61.00),(28,4,6,58.00),(29,5,0,61.00),(30,5,1,63.00),(31,5,2,65.00),(32,5,3,68.00),(33,5,4,64.00),(34,5,5,67.00),(35,5,6,66.00),(36,6,0,65.00),(37,6,1,68.00),(38,6,2,71.00),(39,6,3,69.00),(40,6,4,73.00),(41,6,5,74.00),(42,6,6,72.00),(43,7,0,50.00),(44,7,1,53.00),(45,7,2,55.00),(46,7,3,52.00),(47,7,4,57.00),(48,7,5,54.00),(49,7,6,55.00),(50,8,0,46.00),(51,8,1,48.00),(52,8,2,51.00),(53,8,3,47.00),(54,8,4,50.00),(55,8,5,52.00),(56,8,6,49.00),(57,9,0,57.00),(58,9,1,59.00),(59,9,2,62.00),(60,9,3,60.00),(61,9,4,63.00),(62,9,5,64.00),(63,9,6,61.00);
/*!40000 ALTER TABLE `moisture_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `type` varchar(30) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `zone_id` int(11) DEFAULT NULL,
  `zone_name` varchar(100) DEFAULT NULL,
  `plant` varchar(100) DEFAULT NULL,
  `plant_type` varchar(100) DEFAULT NULL,
  `moisture` decimal(6,2) DEFAULT NULL,
  `threshold` decimal(6,2) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `event_date` varchar(30) DEFAULT NULL,
  `time_text` varchar(10) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'warning','Peringatan','Kelembapan Tanah Rendah','Zona 3 – Tomat (28%) di bawah ambang batas 30%',3,'Zona 3','Tomat','Tomat Merah',28.00,30.00,'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=70','20 Sep 2025','08:15',1),(2,'watering','Penyiraman','Penyiraman Selesai','Zona 1 – Kopi telah selesai disiram (12 Liter, 10 menit)',1,'Zona 1','Kopi','Kopi Arabika',62.00,30.00,'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&q=70','20 Sep 2025','08:00',1),(3,'schedule','Penyiraman','Waktu Penyiraman','Zona 2 – Cabai akan disiram dalam 15 menit',2,'Zona 2','Cabai','Cabai Merah',40.00,30.00,'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=80&q=70','20 Sep 2025','06:45',1),(4,'normal','Kondisi Lahan','Kelembapan Normal','Zona 5 – Selada (65%) dalam kondisi optimal',5,'Zona 5','Selada','Selada',65.00,30.00,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=70','19 Sep 2025','17:30',1),(5,'system','Sistem','Perangkat Online Kembali','Sensor Zona 6 – Terong sudah kembali online',6,'Zona 6','Terong','Terong',55.00,30.00,'https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=80&q=70','19 Sep 2025','16:20',1),(6,'warning','Peringatan','Volume Air Tinggi','Zona 8 – Wortel menggunakan air lebih banyak (20 Liter)',8,'Zona 8','Wortel','Wortel',48.00,30.00,'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&q=70','19 Sep 2025','14:10',1),(7,'watering','Penyiraman','Penyiraman Selesai','Zona 4 – Sawi telah selesai disiram (10 Liter, 8 menit)',4,'Zona 4','Sawi','Sawi Hijau',58.00,30.00,'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=80&q=70','19 Sep 2025','08:00',1),(8,'skip','Sistem','Jadwal Dilewati','Zona 7 – Kubis tidak disiram karena kelembapan cukup',7,'Zona 7','Kubis','Kubis',60.00,30.00,'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=80&q=70','19 Sep 2025','06:00',1),(9,'warning','Peringatan','Kelembapan Tanah Rendah','Zona 9 – Kentang (27%) di bawah ambang batas 30%',9,'Zona 9','Kentang','Kentang',27.00,30.00,'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&q=70','18 Sep 2025','17:45',1),(10,'normal','Kondisi Lahan','Kelembapan Kembali Normal','Zona 3 – Tomat (52%) setelah penyiraman selesai',3,'Zona 3','Tomat','Tomat Merah',52.00,30.00,'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=70','18 Sep 2025','08:45',1),(11,'system','Sistem','Sensor Offline','Sensor Zona 2 – Cabai tidak mengirim data selama 10 menit',2,'Zona 2','Cabai','Cabai Merah',NULL,30.00,'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=80&q=70','18 Sep 2025','07:30',1),(12,'watering','Penyiraman','Penyiraman Selesai','Zona 9 – Kentang telah selesai disiram (12 Liter, 10 menit)',9,'Zona 9','Kentang','Kentang',64.00,30.00,'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&q=70','17 Sep 2025','09:30',1),(13,'normal','Kondisi Lahan','Kondisi Optimal','Zona 1 – Kopi (68%) dalam kondisi sangat baik',1,'Zona 1','Kopi','Kopi Arabika',68.00,30.00,'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&q=70','17 Sep 2025','08:00',1),(14,'schedule','Penyiraman','Waktu Penyiraman','Zona 5 – Selada akan disiram dalam 10 menit',5,'Zona 5','Selada','Selada',38.00,30.00,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=70','17 Sep 2025','07:20',1),(15,'system','Sistem','Koneksi ESP32 Stabil','Semua sensor kembali terhubung dengan sistem',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'16 Sep 2025','14:00',1),(16,'watering','Penyiraman','Penyiraman Selesai','Zona 6 – Terong telah selesai disiram (14 Liter, 10 menit)',6,'Zona 6','Terong','Terong',67.00,30.00,'https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=80&q=70','16 Sep 2025','09:00',1),(17,'normal','Kondisi Lahan','Kelembapan Normal','Zona 4 – Sawi (61%) dalam kondisi optimal',4,'Zona 4','Sawi','Sawi Hijau',61.00,30.00,'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=80&q=70','16 Sep 2025','08:30',1),(18,'skip','Sistem','Jadwal Dilewati','Zona 5 – Selada tidak disiram karena kelembapan sudah optimal',5,'Zona 5','Selada','Selada',66.00,30.00,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=70','15 Sep 2025','08:30',1),(19,'warning','Peringatan','Suhu Tinggi Terdeteksi','Zona 8 – Wortel terdeteksi suhu tanah 34°C di atas batas normal',8,'Zona 8','Wortel','Wortel',42.00,30.00,'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&q=70','15 Sep 2025','13:00',1),(20,'normal','Kondisi Lahan','Kelembapan Normal','Zona 7 – Kubis (55%) dalam kondisi baik',7,'Zona 7','Kubis','Kubis',55.00,30.00,'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=80&q=70','15 Sep 2025','07:00',1),(21,'watering','Penyiraman','Penyiraman Dimulai','Zona 3 – Tomat mulai disiram secara otomatis',3,'Zona 3','Tomat','Tomat Merah',29.00,30.00,'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=70','14 Sep 2025','06:30',1),(22,'system','Sistem','Sistem Restart','Sistem irigasi berhasil direstart dan berjalan normal',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'14 Sep 2025','05:00',1);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_days`
--

DROP TABLE IF EXISTS `schedule_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedule_days` (
  `schedule_id` int(11) NOT NULL,
  `day_name` varchar(10) NOT NULL,
  PRIMARY KEY (`schedule_id`,`day_name`),
  CONSTRAINT `schedule_days_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_days`
--

LOCK TABLES `schedule_days` WRITE;
/*!40000 ALTER TABLE `schedule_days` DISABLE KEYS */;
INSERT INTO `schedule_days` VALUES (1,'Jum'),(1,'Kam'),(1,'Min'),(1,'Rab'),(1,'Sab'),(1,'Sel'),(1,'Sen'),(2,'Jum'),(2,'Kam'),(2,'Min'),(2,'Rab'),(2,'Sab'),(2,'Sel'),(2,'Sen'),(3,'Jum'),(3,'Kam'),(3,'Min'),(3,'Rab'),(3,'Sab'),(3,'Sel'),(3,'Sen'),(4,'Jum'),(4,'Kam'),(4,'Min'),(4,'Rab'),(4,'Sab'),(4,'Sel'),(4,'Sen'),(5,'Jum'),(5,'Kam'),(5,'Min'),(5,'Rab'),(5,'Sab'),(5,'Sel'),(5,'Sen'),(6,'Jum'),(6,'Kam'),(6,'Rab'),(6,'Sab'),(6,'Sel'),(6,'Sen'),(7,'Jum'),(7,'Kam'),(7,'Min'),(7,'Rab'),(7,'Sab'),(7,'Sel'),(7,'Sen'),(8,'Jum'),(8,'Kam'),(8,'Min'),(8,'Rab'),(8,'Sab'),(8,'Sel'),(8,'Sen'),(9,'Jum'),(9,'Kam'),(9,'Min'),(9,'Rab'),(9,'Sab'),(9,'Sel'),(9,'Sen');
/*!40000 ALTER TABLE `schedule_days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `zone_id` int(11) DEFAULT NULL,
  `zone_name` varchar(100) DEFAULT NULL,
  `plant` varchar(100) DEFAULT NULL,
  `plant_type` varchar(100) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `time_text` varchar(10) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `flow_rate` decimal(8,2) DEFAULT NULL,
  `estimated_water` decimal(8,2) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `mode` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,1,'Zona 1','Kopi','Kopi Arabika','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&q=70','06:00',10,1.20,12.00,1,'Otomatis'),(2,2,'Zona 2','Cabai','Cabai Merah','https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=80&q=70','07:00',8,1.20,10.00,1,'Otomatis'),(3,3,'Zona 3','Tomat','Tomat','https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=70','06:30',10,1.20,15.00,1,'Otomatis'),(4,4,'Zona 4','Sawi','Sawi Hijau','https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=80&q=70','08:00',8,1.20,10.00,1,'Otomatis'),(5,5,'Zona 5','Selada','Selada','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=70','08:30',8,1.20,10.00,1,'Otomatis'),(6,6,'Zona 6','Terong','Terong','https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=80&q=70','09:00',10,1.20,14.00,1,'Otomatis'),(7,7,'Zona 7','Kubis','Kubis','https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=80&q=70','06:00',8,1.20,12.00,1,'Otomatis'),(8,8,'Zona 8','Wortel','Wortel','https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&q=70','07:30',10,1.20,15.00,1,'Manual'),(9,9,'Zona 9','Kentang','Kentang','https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&q=70','09:30',10,1.20,12.00,1,'Otomatis');
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensors`
--

DROP TABLE IF EXISTS `sensors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sensors` (
  `id` varchar(50) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `label` varchar(100) DEFAULT NULL,
  `value` decimal(6,2) DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `zone_id` (`zone_id`),
  CONSTRAINT `sensors_ibfk_1` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensors`
--

LOCK TABLES `sensors` WRITE;
/*!40000 ALTER TABLE `sensors` DISABLE KEYS */;
INSERT INTO `sensors` VALUES ('S1-1',1,'Sensor 1',35.00,'Normal'),('S1-2',1,'Sensor 2',38.00,'Normal'),('S1-3',1,'Sensor 3',41.00,'Normal'),('S2-1',2,'Sensor 1',60.00,'Normal'),('S2-2',2,'Sensor 2',63.00,'Normal'),('S2-3',2,'Sensor 3',63.00,'Normal'),('S3-1',3,'Sensor 1',33.00,'Normal'),('S3-2',3,'Sensor 2',36.00,'Normal'),('S3-3',3,'Sensor 3',36.00,'Bermasalah'),('S4-1',4,'Sensor 1',56.00,'Normal'),('S4-2',4,'Sensor 2',59.00,'Normal'),('S4-3',4,'Sensor 3',59.00,'Normal'),('S5-1',5,'Sensor 1',64.00,'Normal'),('S5-2',5,'Sensor 2',67.00,'Normal'),('S5-3',5,'Sensor 3',67.00,'Normal'),('S6-1',6,'Sensor 1',70.00,'Normal'),('S6-2',6,'Sensor 2',73.00,'Normal'),('S6-3',6,'Sensor 3',73.00,'Normal'),('S7-1',7,'Sensor 1',53.00,'Normal'),('S7-2',7,'Sensor 2',56.00,'Normal'),('S7-3',7,'Sensor 3',56.00,'Normal'),('S8-1',8,'Sensor 1',47.00,'Normal'),('S8-2',8,'Sensor 2',50.00,'Normal'),('S8-3',8,'Sensor 3',50.00,'Offline'),('S9-1',9,'Sensor 1',59.00,'Normal'),('S9-2',9,'Sensor 2',62.00,'Normal'),('S9-3',9,'Sensor 3',62.00,'Normal');
/*!40000 ALTER TABLE `sensors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password_hash` varchar(128) NOT NULL,
  `password_salt` varchar(64) NOT NULL,
  `name` varchar(150) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'Operator',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zone_images`
--

DROP TABLE IF EXISTS `zone_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zone_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `zone_id` int(11) NOT NULL,
  `image_url` text NOT NULL,
  `sort_order` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `zone_id` (`zone_id`),
  CONSTRAINT `zone_images_ibfk_1` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zone_images`
--

LOCK TABLES `zone_images` WRITE;
/*!40000 ALTER TABLE `zone_images` DISABLE KEYS */;
INSERT INTO `zone_images` VALUES (1,1,'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',0),(2,1,'https://images.unsplash.com/photo-1509564551897-0b8e39c74e9e?w=300&q=70',1),(3,1,'https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=300&q=70',2),(4,2,'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=600&q=80',0),(5,2,'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=300&q=70',1),(6,3,'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&q=80',0),(7,4,'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=600&q=80',0),(8,5,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',0),(9,6,'https://images.unsplash.com/photo-1601472544100-0b8e2a96e5e4?w=600&q=80',0),(10,7,'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80',0),(11,8,'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80',0),(12,9,'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80',0);
/*!40000 ALTER TABLE `zone_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zones`
--

DROP TABLE IF EXISTS `zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zones` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `plant` varchar(100) DEFAULT NULL,
  `moisture` decimal(5,2) DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  `device_status` varchar(30) DEFAULT NULL,
  `soil_temp` decimal(5,2) DEFAULT NULL,
  `last_updated` varchar(50) DEFAULT NULL,
  `area` varchar(50) DEFAULT NULL,
  `soil_type` varchar(100) DEFAULT NULL,
  `water_need` varchar(50) DEFAULT NULL,
  `target_moisture_min` int(11) DEFAULT NULL,
  `target_moisture_max` int(11) DEFAULT NULL,
  `moisture_min` int(11) DEFAULT NULL,
  `moisture_mid` int(11) DEFAULT NULL,
  `moisture_max` int(11) DEFAULT NULL,
  `irrigation_duration` int(11) DEFAULT NULL,
  `estimated_water` decimal(8,2) DEFAULT NULL,
  `image` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zones`
--

LOCK TABLES `zones` WRITE;
/*!40000 ALTER TABLE `zones` DISABLE KEYS */;
INSERT INTO `zones` VALUES (1,'Zona 1','Kopi',38.00,'Kering','Online',28.50,'5 menit lalu','30 m²','Lempung','Sedang',50,70,30,60,80,10,12.00,'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80'),(2,'Zona 2','Cabai',62.00,'Normal','Online',27.20,'3 menit lalu','30 m²','Lempung Berpasir','Sedang',55,75,30,65,85,8,9.00,'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=600&q=80'),(3,'Zona 3','Tomat',35.00,'Kering','Online',29.10,'8 menit lalu','30 m²','Lempung','Tinggi',60,80,40,70,90,15,18.00,'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&q=80'),(4,'Zona 4','Sawi',58.00,'Normal','Online',26.80,'2 menit lalu','30 m²','Tanah Humus','Sedang',50,70,30,60,80,7,8.00,'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=600&q=80'),(5,'Zona 5','Selada',66.00,'Normal','Online',25.60,'1 menit lalu','30 m²','Tanah Humus','Tinggi',60,80,40,70,90,6,7.00,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80'),(6,'Zona 6','Jagung',72.00,'Basah','Online',26.30,'4 menit lalu','30 m²','Lempung Berdebu','Tinggi',55,75,40,65,85,0,0.00,'https://images.unsplash.com/photo-1601472544100-0b8e2a96e5e4?w=600&q=80'),(7,'Zona 7','Kubis',55.00,'Normal','Online',27.00,'6 menit lalu','30 m²','Lempung','Sedang',50,70,30,60,80,9,10.00,'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80'),(8,'Zona 8','Wortel',49.00,'Normal','Online',27.80,'7 menit lalu','30 m²','Lempung Berpasir','Sedang',45,65,30,55,75,11,13.00,'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80'),(9,'Zona 9','Kentang',61.00,'Normal','Online',26.50,'2 menit lalu','30 m²','Tanah Berhumus','Sedang',55,75,35,65,85,8,10.00,'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80');
/*!40000 ALTER TABLE `zones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'irigasi_cerdas'
--

--
-- Dumping routines for database 'irigasi_cerdas'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-27 12:06:58
