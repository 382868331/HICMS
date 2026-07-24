-- 通讯录成员表
DROP TABLE IF EXISTS `meeting_member`;

CREATE TABLE `meeting_member` (
    `member_id`          bigint(20)    NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id`            varchar(64)   DEFAULT NULL COMMENT '用户ID',
    `user_name`          varchar(64)   DEFAULT NULL COMMENT '用户名',
    `phone`              varchar(20)   DEFAULT NULL COMMENT '手机号',
    `wechat`             varchar(128)  DEFAULT NULL COMMENT '微信号',
    `email`              varchar(128)  DEFAULT NULL COMMENT '邮箱',
    `department`         varchar(128)  DEFAULT NULL COMMENT '部门',
    `duty_date`          date          DEFAULT NULL COMMENT '值班日期',
    `is_miniapp_auth`    char(1)       DEFAULT '0' COMMENT '是否授权小程序(0否 1是)',
    `is_info_center`     char(1)       DEFAULT '0' COMMENT '是否信息中心人员(0否 1是)',
    `is_jiyao_bureau`    char(1)       DEFAULT '0' COMMENT '是否机要局人员(0否 1是)',
    `is_meeting_organizer` char(1)     DEFAULT '0' COMMENT '是否办会人员(0否 1是)',
    `is_current_duty`    char(1)       DEFAULT '0' COMMENT '是否当前值班人员(0否 1是)',
    `create_by`          varchar(64)   DEFAULT '' COMMENT '创建者',
    `create_time`        datetime      DEFAULT NULL COMMENT '创建时间',
    `update_by`          varchar(64)   DEFAULT '' COMMENT '更新者',
    `update_time`        datetime      DEFAULT NULL COMMENT '更新时间',
    `remark`             varchar(500)  DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='通讯录成员表';

-- 插入测试数据，覆盖各种场景
INSERT INTO `meeting_member` (`user_id`, `user_name`, `phone`, `wechat`, `email`, `department`, `duty_date`, `is_miniapp_auth`, `is_info_center`, `is_jiyao_bureau`, `is_meeting_organizer`, `is_current_duty`, `create_by`, `create_time`, `remark`) VALUES
('U001', '张三',     '13800001001', 'zhangsan_wx',     'zhangsan@example.com',   '信息中心',  CURDATE(),                '1', '1', '0', '0', '1', 'admin', NOW(), '信息中心值班人员'),
('U002', '李四',     '13800001002', 'lisi_wx',         'lisi@example.com',       '信息中心',  CURDATE(),                '1', '1', '0', '1', '1', 'admin', NOW(), '信息中心值班+办会人员'),
('U003', '王五',     '13800001003', 'wangwu_wx',       'wangwu@example.com',     '机要局',    CURDATE(),                '0', '0', '1', '0', '1', 'admin', NOW(), '机要局值班人员'),
('U004', '赵六',     '13800001004', 'zhaoliu_wx',      'zhaoliu@example.com',    '机要局',    CURDATE(),                '1', '0', '1', '1', '1', 'admin', NOW(), '机要局值班+办会人员，已授权小程序'),
('U005', '孙七',     '13800001005', 'sunqi_wx',        'sunqi@example.com',      '综合科',    DATE_SUB(CURDATE(), INTERVAL 1 DAY), '1', '0', '0', '1', '1', 'admin', NOW(), '综合科昨天值班人员'),
('U006', '周八',     '13800001006', 'zhouba_wx',       'zhouba@example.com',     '综合科',    DATE_SUB(CURDATE(), INTERVAL 2 DAY), '0', '0', '0', '1', '0', 'admin', NOW(), '综合科前两天值班，已过期'),
('U007', '吴九',     '13800001007', 'wujiu_wx',        'wujiu@example.com',      '办公室',    CURDATE(),                '1', '0', '0', '0', '1', 'admin', NOW(), '办公室值班人员，已授权小程序'),
('U008', '郑十',     '13800001008', 'zhengshi_wx',     'zhengshi@example.com',   '办公室',    DATE_ADD(CURDATE(), INTERVAL 1 DAY), '0', '0', '0', '1', '0', 'admin', NOW(), '办公室明天办会，非值班'),
('U009', '陈一',     '13800001009', 'chenyi_wx',       'chenyi@example.com',     '信息中心',  DATE_SUB(CURDATE(), INTERVAL 3 DAY), '1', '1', '0', '0', '0', 'admin', NOW(), '信息中心三天前值班，已过期'),
('U010', '刘二',     '13800001010', 'liuer_wx',        'liuer@example.com',      '机要局',    DATE_ADD(CURDATE(), INTERVAL 2 DAY), '0', '0', '1', '0', '0', 'admin', NOW(), '机要局未来排班，非当前值班'),
('U011', '黄十一',   '13800001011', 'huang11_wx',      'huang11@example.com',    '信息中心',  DATE_SUB(CURDATE(), INTERVAL 5 DAY), '1', '1', '0', '1', '0', 'admin', NOW(), '信息中心办会人员，五天前值班'),
('U012', '林十二',   '13800001012', 'lin12_wx',        'lin12@example.com',      '机要局',    DATE_SUB(CURDATE(), INTERVAL 4 DAY), '0', '0', '1', '1', '0', 'admin', NOW(), '机要局办会人员，四天前值班'),
('U013', '杨十三',   '13800001013', 'yang13_wx',       'yang13@example.com',     '综合科',    DATE_ADD(CURDATE(), INTERVAL 3 DAY), '1', '0', '0', '0', '0', 'admin', NOW(), '综合科未来排班'),
('U014', '何十四',   '13800001014', 'he14_wx',         'he14@example.com',       '办公室',    DATE_SUB(CURDATE(), INTERVAL 6 DAY), '0', '0', '0', '0', '0', 'admin', NOW(), '办公室六天前值班，已过期'),
('U015', '马十五',   '13800001015', 'ma15_wx',         'ma15@example.com',       '信息中心',  CURDATE(),                '0', '1', '0', '0', '1', 'admin', NOW(), '信息中心今日值班，未授权小程序');
