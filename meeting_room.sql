/*
 Navicat Premium Dump SQL

 Source Server         : 本地mysql
 Source Server Type    : MySQL
 Source Server Version : 90200 (9.2.0)
 Source Host           : 127.0.0.1:3306
 Source Schema         : db_hicms

 Target Server Type    : MySQL
 Target Server Version : 90200 (9.2.0)
 File Encoding         : 65001

 Date: 06/07/2026 13:43:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for meeting_room
-- ----------------------------
DROP TABLE IF EXISTS `meeting_room`;
CREATE TABLE `meeting_room`  (
  `room_id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ä¼šè®®å®¤ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT 'ä¼šè®®å®¤åç§°',
  `normal_capacity` int NULL DEFAULT 0 COMMENT 'æ­£å¸¸å®¹çº³äººæ•°',
  `covid_capacity` int NULL DEFAULT 0 COMMENT 'ç–«æƒ…å®¹çº³äººæ•°',
  `applicable_scope` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT 'é€‚ç”¨èŒƒå›´',
  `layout` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT 'ä¼šåœºæ‘†æ”¾',
  `area_size` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT 'ä¼šåœºç±³æ•°',
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT 'å›¾ç‰‡URL',
  `booking_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT 'é¢„å®šæƒ…å†µJSONä¸²',
  `create_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT 'åˆ›å»ºè€…',
  `create_time` datetime NULL DEFAULT NULL COMMENT 'åˆ›å»ºæ—¶é—´',
  `update_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT 'æ›´æ–°è€…',
  `update_time` datetime NULL DEFAULT NULL COMMENT 'æ›´æ–°æ—¶é—´',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'å¤‡æ³¨',
  PRIMARY KEY (`room_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ä¼šè®®å®¤è¡¨' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of meeting_room
-- ----------------------------
INSERT INTO `meeting_room` VALUES (1, 'å¤§ç¤¼å ‚', 500, 200, 'å…¨ä½“ä¼šè®®ã€å¤§åž‹æ´»åŠ¨', 'å‰§é™¢å¼', '800', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=grand+auditorium+hall&image_size=landscape_16_9', '[{\"booker\":\"å¼ ä¸‰\",\"startTime\":\"2026-07-07 09:00:00\",\"endTime\":\"2026-07-07 12:00:00\"},{\"booker\":\"æŽå››\",\"startTime\":\"2026-07-07 14:00:00\",\"endTime\":\"2026-07-07 17:00:00\"}]', 'admin', '2026-07-06 05:38:44', '', NULL, 'ä¸€æ¥¼ï¼Œé…LEDå¤§å±');
INSERT INTO `meeting_room` VALUES (2, 'ç¬¬ä¸€ä¼šè®®å®¤', 30, 15, 'éƒ¨é—¨ä¼šè®®ã€å°åž‹ç ”è®¨', 'åœ†æ¡Œå¼', '60', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=small+conference+room+round+table&image_size=landscape_16_9', '[{\"booker\":\"çŽ‹äº”\",\"startTime\":\"2026-07-08 10:00:00\",\"endTime\":\"2026-07-08 11:30:00\"}]', 'admin', '2026-07-06 05:38:44', '', NULL, 'ä¸‰æ¥¼301å®¤');
INSERT INTO `meeting_room` VALUES (3, 'ç¬¬äºŒä¼šè®®å®¤', 20, 10, 'éƒ¨é—¨ä¼šè®®', 'é•¿æ¡Œå¼', '40', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=meeting+room+long+table&image_size=landscape_16_9', '[]', 'admin', '2026-07-06 05:38:44', '', NULL, 'ä¸‰æ¥¼302å®¤');
INSERT INTO `meeting_room` VALUES (4, 'ç¬¬ä¸‰ä¼šè®®å®¤', 40, 20, 'ä¸­åž‹ä¼šè®®ã€åŸ¹è®­', 'è¯¾æ¡Œå¼', '80', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=training+room+classroom+style&image_size=landscape_16_9', '[{\"booker\":\"èµµå…­\",\"startTime\":\"2026-07-09 09:00:00\",\"endTime\":\"2026-07-09 17:00:00\"},{\"booker\":\"å­™ä¸ƒ\",\"startTime\":\"2026-07-10 09:00:00\",\"endTime\":\"2026-07-10 12:00:00\"}]', 'admin', '2026-07-06 05:38:44', '', NULL, 'ä¸‰æ¥¼303å®¤ï¼Œé…æŠ•å½±ä»ª');
INSERT INTO `meeting_room` VALUES (5, 'è´µå®¾æŽ¥å¾…å®¤', 15, 8, 'VIPæŽ¥å¾…ã€é‡è¦ä¼šæ™¤', 'æ²™å‘å¼', '50', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury+VIP+reception+room&image_size=landscape_16_9', '[]', 'admin', '2026-07-06 05:38:44', '', NULL, 'äºŒæ¥¼201å®¤ï¼Œè±ªåŽè£…ä¿®');
INSERT INTO `meeting_room` VALUES (6, 'è§†é¢‘ä¼šè®®å®¤', 25, 12, 'è¿œç¨‹è§†é¢‘ä¼šè®®', 'é•¿æ¡Œå¼', '55', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video+conference+room+modern&image_size=landscape_16_9', '[{\"booker\":\"å‘¨å…«\",\"startTime\":\"2026-07-11 14:00:00\",\"endTime\":\"2026-07-11 16:00:00\"}]', 'admin', '2026-07-06 05:38:44', '', NULL, 'é…é«˜æ¸…è§†é¢‘ä¼šè®®ç³»ç»Ÿ');
INSERT INTO `meeting_room` VALUES (7, 'å¤šåŠŸèƒ½åŽ…', 200, 80, 'å¤§åž‹ä¼šè®®ã€æ–‡è‰ºæ¼”å‡º', 'å‰§é™¢å¼', '400', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=multi+function+hall&image_size=landscape_16_9', '[{\"booker\":\"å´ä¹\",\"startTime\":\"2026-07-12 08:00:00\",\"endTime\":\"2026-07-12 18:00:00\"}]', 'admin', '2026-07-06 05:38:44', '', NULL, 'ä¸€æ¥¼ï¼Œé…èˆžå°ç¯å…‰éŸ³å“');
INSERT INTO `meeting_room` VALUES (8, 'ç¬¬å››ä¼šè®®å®¤', 12, 6, 'å°åž‹è®¨è®ºã€é¢è¯•', 'åœ†æ¡Œå¼', '25', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=small+discussion+room&image_size=landscape_16_9', '[]', 'admin', '2026-07-06 05:38:44', '', NULL, 'å››æ¥¼401å®¤');
INSERT INTO `meeting_room` VALUES (9, 'æŠ¥å‘ŠåŽ…', 300, 120, 'å­¦æœ¯æŠ¥å‘Šã€å¤§åž‹åŸ¹è®­', 'è¯¾æ¡Œå¼', '500', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=lecture+hall+modern&image_size=landscape_16_9', '[{\"booker\":\"éƒ‘å\",\"startTime\":\"2026-07-13 09:00:00\",\"endTime\":\"2026-07-13 11:00:00\"},{\"booker\":\"å†¯åä¸€\",\"startTime\":\"2026-07-13 14:00:00\",\"endTime\":\"2026-07-13 17:00:00\"}]', 'admin', '2026-07-06 05:38:44', '', NULL, 'é…ä¸“ä¸šéŸ³å“æŠ•å½±è®¾å¤‡');
INSERT INTO `meeting_room` VALUES (10, 'å…šå‘˜æ´»åŠ¨å®¤', 50, 25, 'å…šå»ºæ´»åŠ¨ã€å°åž‹ä¼šè®®', 'åœ†æ¡Œå¼', '70', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=party+activity+room&image_size=landscape_16_9', '[]', 'admin', '2026-07-06 05:38:44', '', NULL, 'äºŒæ¥¼202å®¤');
INSERT INTO `meeting_room` VALUES (11, 'ç¬¬äº”ä¼šè®®å®¤', 16, 8, 'éƒ¨é—¨ä¼šè®®', 'é•¿æ¡Œå¼', '35', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=corner+meeting+room&image_size=landscape_16_9', '[]', 'admin', '2026-07-06 05:38:44', '', NULL, 'å››æ¥¼402å®¤');
INSERT INTO `meeting_room` VALUES (12, 'æ´½è°ˆå®¤A', 8, 4, 'å•†åŠ¡æ´½è°ˆã€é¢è¯•', 'æ²™å‘å¼', '20', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business+negotiation+room&image_size=landscape_16_9', '[{\"booker\":\"é™ˆåäºŒ\",\"startTime\":\"2026-07-14 10:00:00\",\"endTime\":\"2026-07-14 11:00:00\"}]', 'admin', '2026-07-06 05:38:44', '', NULL, 'ä¸€æ¥¼å¤§åŽ…æ—');
INSERT INTO `meeting_room` VALUES (13, 'æ´½è°ˆå®¤B', 8, 4, 'å•†åŠ¡æ´½è°ˆã€é¢è¯•', 'æ²™å‘å¼', '20', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cozy+meeting+room&image_size=landscape_16_9', '[]', 'admin', '2026-07-06 05:38:44', '', NULL, 'ä¸€æ¥¼å¤§åŽ…æ—');
INSERT INTO `meeting_room` VALUES (14, 'åŸ¹è®­å®¤', 60, 30, 'å‘˜å·¥åŸ¹è®­ã€æŠ€èƒ½è€ƒæ ¸', 'è¯¾æ¡Œå¼', '120', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=training+classroom&image_size=landscape_16_9', '[{\"booker\":\"è¤šåä¸‰\",\"startTime\":\"2026-07-15 09:00:00\",\"endTime\":\"2026-07-15 17:00:00\"}]', 'admin', '2026-07-06 05:38:44', '', NULL, 'å››æ¥¼403å®¤ï¼Œé…30å°ç”µè„‘');
INSERT INTO `meeting_room` VALUES (15, 'åœ†æ¡Œä¼šè®®å®¤', 20, 10, 'åœ†æ¡Œä¼šè®®ã€å¤´è„‘é£Žæš´', 'åœ†æ¡Œå¼', '45', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=round+table+boardroom&image_size=landscape_16_9', '[]', 'admin', '2026-07-06 05:38:44', '', NULL, 'ä¸‰æ¥¼304å®¤');

SET FOREIGN_KEY_CHECKS = 1;
