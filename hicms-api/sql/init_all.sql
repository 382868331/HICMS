SET NAMES utf8mb4;

-- ============================================
-- 第一部分：建表语句 (DDL)
-- ============================================

-- ----------------------------
-- 1. 会议室表
-- ----------------------------
DROP TABLE IF EXISTS meeting_room;
CREATE TABLE meeting_room (
  room_id           bigint(20)      NOT NULL AUTO_INCREMENT  COMMENT '会议室ID',
  name              varchar(64)     NOT NULL                 COMMENT '会议室名称',
  normal_capacity   int(4)          DEFAULT 0                COMMENT '正常容量',
  covid_capacity    int(4)          DEFAULT 0                COMMENT '疫情防控容量',
  applicable_scope  varchar(255)    DEFAULT ''               COMMENT '适用范围',
  layout            varchar(32)     DEFAULT ''               COMMENT '布局形式',
  area_size         varchar(32)     DEFAULT ''               COMMENT '面积',
  image_url         varchar(500)    DEFAULT ''               COMMENT '图片地址',
  booking_json      text                                     COMMENT '预定JSON数据',
  create_by         varchar(64)     DEFAULT ''               COMMENT '创建者',
  create_time       datetime                                 COMMENT '创建时间',
  update_by         varchar(64)     DEFAULT ''               COMMENT '更新者',
  update_time       datetime                                 COMMENT '更新时间',
  remark            varchar(500)    DEFAULT NULL             COMMENT '备注',
  PRIMARY KEY (room_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='会议室表';

-- ----------------------------
-- 2. 会议预定表
-- ----------------------------
DROP TABLE IF EXISTS meeting_book;
CREATE TABLE meeting_book (
  book_id              bigint(20)      NOT NULL AUTO_INCREMENT  COMMENT '预定ID',
  room_name            varchar(64)     DEFAULT ''               COMMENT '会议室名称',
  room_id              bigint(20)      DEFAULT NULL             COMMENT '会议室ID',
  booker_name          varchar(64)     DEFAULT ''               COMMENT '预定人姓名',
  booker_id            bigint(20)      DEFAULT NULL             COMMENT '预定人ID',
  meeting_name         varchar(255)    DEFAULT ''               COMMENT '会议名称',
  leader_name          varchar(64)     DEFAULT ''               COMMENT '参会领导',
  audio_file_url       varchar(500)    DEFAULT ''               COMMENT '录音文件地址',
  audio_transcript_url varchar(500)    DEFAULT ''               COMMENT '录音转写文本地址',
  meeting_start_time   datetime                                 COMMENT '会议开始时间',
  meeting_end_time     datetime                                 COMMENT '会议结束时间',
  agenda_pdf_url       varchar(500)    DEFAULT ''               COMMENT '会议议程PDF地址',
  seat_map_url         varchar(500)    DEFAULT ''               COMMENT '座位图地址',
  is_online            char(1)         DEFAULT '0'              COMMENT '是否线上会议(0否 1是)',
  is_hxy               char(1)         DEFAULT '0'              COMMENT '是否好信云(0否 1是)',
  is_jyj_line          char(1)         DEFAULT '0'              COMMENT '是否机要局专线(0否 1是)',
  is_gb_line           char(1)         DEFAULT '0'              COMMENT '是否国办专线(0否 1是)',
  is_canceled          char(1)         DEFAULT '0'              COMMENT '是否已取消(0否 1是)',
  is_finished          char(1)         DEFAULT '0'              COMMENT '是否已结束(0否 1是)',
  create_by            varchar(64)     DEFAULT ''               COMMENT '创建者',
  create_time          datetime                                 COMMENT '创建时间',
  update_by            varchar(64)     DEFAULT ''               COMMENT '更新者',
  update_time          datetime                                 COMMENT '更新时间',
  remark               varchar(500)    DEFAULT NULL             COMMENT '备注',
  PRIMARY KEY (book_id),
  KEY idx_room_id (room_id),
  KEY idx_meeting_start_time (meeting_start_time)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='会议预定表';

-- ----------------------------
-- 3. 通讯录成员表
-- ----------------------------
DROP TABLE IF EXISTS meeting_member;
CREATE TABLE meeting_member (
    member_id            bigint(20)    NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id              varchar(64)   DEFAULT NULL            COMMENT '用户ID',
    user_name            varchar(64)   DEFAULT NULL            COMMENT '用户名',
    phone                varchar(20)   DEFAULT NULL            COMMENT '手机号',
    wechat               varchar(128)  DEFAULT NULL            COMMENT '微信号',
    email                varchar(128)  DEFAULT NULL            COMMENT '邮箱',
    department           varchar(128)  DEFAULT NULL            COMMENT '部门',
    duty_date            date          DEFAULT NULL            COMMENT '值班日期',
    is_miniapp_auth      char(1)       DEFAULT '0'             COMMENT '是否授权小程序(0否 1是)',
    is_info_center       char(1)       DEFAULT '0'             COMMENT '是否信息中心人员(0否 1是)',
    is_jiyao_bureau      char(1)       DEFAULT '0'             COMMENT '是否机要局人员(0否 1是)',
    is_meeting_organizer char(1)       DEFAULT '0'             COMMENT '是否办会人员(0否 1是)',
    is_current_duty      char(1)       DEFAULT '0'             COMMENT '是否当前值班人员(0否 1是)',
    create_by            varchar(64)   DEFAULT ''              COMMENT '创建者',
    create_time          datetime      DEFAULT NULL            COMMENT '创建时间',
    update_by            varchar(64)   DEFAULT ''              COMMENT '更新者',
    update_time          datetime      DEFAULT NULL            COMMENT '更新时间',
    remark               varchar(500)  DEFAULT NULL            COMMENT '备注',
    PRIMARY KEY (member_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='通讯录成员表';

-- ============================================
-- Quartz 定时任务表 (11张)
-- ============================================

-- 4. 任务详细信息表
DROP TABLE IF EXISTS QRTZ_JOB_DETAILS;
CREATE TABLE QRTZ_JOB_DETAILS (
    sched_name           varchar(120)    not null            comment '调度名称',
    job_name             varchar(200)    not null            comment '任务名称',
    job_group            varchar(200)    not null            comment '任务组名',
    description          varchar(250)    null                comment '相关介绍',
    job_class_name       varchar(250)    not null            comment '执行任务类名称',
    is_durable           varchar(1)      not null            comment '是否持久化',
    is_nonconcurrent     varchar(1)      not null            comment '是否并发',
    is_update_data       varchar(1)      not null            comment '是否更新数据',
    requests_recovery    varchar(1)      not null            comment '是否接受恢复执行',
    job_data             blob            null                comment '存放持久化job对象',
    primary key (sched_name, job_name, job_group)
) engine=innodb comment = '任务详细信息表';

-- 5. 触发器详细信息表
DROP TABLE IF EXISTS QRTZ_TRIGGERS;
CREATE TABLE QRTZ_TRIGGERS (
    sched_name           varchar(120)    not null            comment '调度名称',
    trigger_name         varchar(200)    not null            comment '触发器的名字',
    trigger_group        varchar(200)    not null            comment '触发器所属组的名字',
    job_name             varchar(200)    not null            comment 'qrtz_job_details表job_name的外键',
    job_group            varchar(200)    not null            comment 'qrtz_job_details表job_group的外键',
    description          varchar(250)    null                comment '相关介绍',
    next_fire_time       bigint(13)      null                comment '上一次触发时间（毫秒）',
    prev_fire_time       bigint(13)      null                comment '下一次触发时间（默认为-1表示不触发）',
    priority             integer         null                comment '优先级',
    trigger_state        varchar(16)     not null            comment '触发器状态',
    trigger_type         varchar(8)      not null            comment '触发器的类型',
    start_time           bigint(13)      not null            comment '开始时间',
    end_time             bigint(13)      null                comment '结束时间',
    calendar_name        varchar(200)    null                comment '日程表名称',
    misfire_instr        smallint(2)     null                comment '补偿执行的策略',
    job_data             blob            null                comment '存放持久化job对象',
    primary key (sched_name, trigger_name, trigger_group),
    foreign key (sched_name, job_name, job_group) references QRTZ_JOB_DETAILS(sched_name, job_name, job_group)
) engine=innodb comment = '触发器详细信息表';

-- 6. 简单触发器的信息表
DROP TABLE IF EXISTS QRTZ_SIMPLE_TRIGGERS;
CREATE TABLE QRTZ_SIMPLE_TRIGGERS (
    sched_name           varchar(120)    not null            comment '调度名称',
    trigger_name         varchar(200)    not null            comment 'qrtz_triggers表trigger_name的外键',
    trigger_group        varchar(200)    not null            comment 'qrtz_triggers表trigger_group的外键',
    repeat_count         bigint(7)       not null            comment '重复的次数统计',
    repeat_interval      bigint(12)      not null            comment '重复的间隔时间',
    times_triggered      bigint(10)      not null            comment '已经触发的次数',
    primary key (sched_name, trigger_name, trigger_group),
    foreign key (sched_name, trigger_name, trigger_group) references QRTZ_TRIGGERS(sched_name, trigger_name, trigger_group)
) engine=innodb comment = '简单触发器的信息表';

-- 7. Cron类型的触发器表
DROP TABLE IF EXISTS QRTZ_CRON_TRIGGERS;
CREATE TABLE QRTZ_CRON_TRIGGERS (
    sched_name           varchar(120)    not null            comment '调度名称',
    trigger_name         varchar(200)    not null            comment 'qrtz_triggers表trigger_name的外键',
    trigger_group        varchar(200)    not null            comment 'qrtz_triggers表trigger_group的外键',
    cron_expression      varchar(200)    not null            comment 'cron表达式',
    time_zone_id         varchar(80)                         comment '时区',
    primary key (sched_name, trigger_name, trigger_group),
    foreign key (sched_name, trigger_name, trigger_group) references QRTZ_TRIGGERS(sched_name, trigger_name, trigger_group)
) engine=innodb comment = 'Cron类型的触发器表';

-- 8. Blob类型的触发器表
DROP TABLE IF EXISTS QRTZ_BLOB_TRIGGERS;
CREATE TABLE QRTZ_BLOB_TRIGGERS (
    sched_name           varchar(120)    not null            comment '调度名称',
    trigger_name         varchar(200)    not null            comment 'qrtz_triggers表trigger_name的外键',
    trigger_group        varchar(200)    not null            comment 'qrtz_triggers表trigger_group的外键',
    blob_data            blob            null                comment '存放持久化Trigger对象',
    primary key (sched_name, trigger_name, trigger_group),
    foreign key (sched_name, trigger_name, trigger_group) references QRTZ_TRIGGERS(sched_name, trigger_name, trigger_group)
) engine=innodb comment = 'Blob类型的触发器表';

-- 9. 日历信息表
DROP TABLE IF EXISTS QRTZ_CALENDARS;
CREATE TABLE QRTZ_CALENDARS (
    sched_name           varchar(120)    not null            comment '调度名称',
    calendar_name        varchar(200)    not null            comment '日历名称',
    calendar             blob            not null            comment '存放持久化calendar对象',
    primary key (sched_name, calendar_name)
) engine=innodb comment = '日历信息表';

-- 10. 暂停的触发器表
DROP TABLE IF EXISTS QRTZ_PAUSED_TRIGGER_GRPS;
CREATE TABLE QRTZ_PAUSED_TRIGGER_GRPS (
    sched_name           varchar(120)    not null            comment '调度名称',
    trigger_group        varchar(200)    not null            comment 'qrtz_triggers表trigger_group的外键',
    primary key (sched_name, trigger_group)
) engine=innodb comment = '暂停的触发器表';

-- 11. 已触发的触发器表
DROP TABLE IF EXISTS QRTZ_FIRED_TRIGGERS;
CREATE TABLE QRTZ_FIRED_TRIGGERS (
    sched_name           varchar(120)    not null            comment '调度名称',
    entry_id             varchar(95)     not null            comment '调度器实例id',
    trigger_name         varchar(200)    not null            comment 'qrtz_triggers表trigger_name的外键',
    trigger_group        varchar(200)    not null            comment 'qrtz_triggers表trigger_group的外键',
    instance_name        varchar(200)    not null            comment '调度器实例名',
    fired_time           bigint(13)      not null            comment '触发的时间',
    sched_time           bigint(13)      not null            comment '定时器制定的时间',
    priority             integer         not null            comment '优先级',
    state                varchar(16)     not null            comment '状态',
    job_name             varchar(200)    null                comment '任务名称',
    job_group            varchar(200)    null                comment '任务组名',
    is_nonconcurrent     varchar(1)      null                comment '是否并发',
    requests_recovery    varchar(1)      null                comment '是否接受恢复执行',
    primary key (sched_name, entry_id)
) engine=innodb comment = '已触发的触发器表';

-- 12. 调度器状态表
DROP TABLE IF EXISTS QRTZ_SCHEDULER_STATE;
CREATE TABLE QRTZ_SCHEDULER_STATE (
    sched_name           varchar(120)    not null            comment '调度名称',
    instance_name        varchar(200)    not null            comment '实例名称',
    last_checkin_time    bigint(13)      not null            comment '上次检查时间',
    checkin_interval     bigint(13)      not null            comment '检查间隔时间',
    primary key (sched_name, instance_name)
) engine=innodb comment = '调度器状态表';

-- 13. 存储的悲观锁信息表
DROP TABLE IF EXISTS QRTZ_LOCKS;
CREATE TABLE QRTZ_LOCKS (
    sched_name           varchar(120)    not null            comment '调度名称',
    lock_name            varchar(40)     not null            comment '悲观锁名称',
    primary key (sched_name, lock_name)
) engine=innodb comment = '存储的悲观锁信息表';

-- 14. 同步机制的行锁表
DROP TABLE IF EXISTS QRTZ_SIMPROP_TRIGGERS;
CREATE TABLE QRTZ_SIMPROP_TRIGGERS (
    sched_name           varchar(120)    not null            comment '调度名称',
    trigger_name         varchar(200)    not null            comment 'qrtz_triggers表trigger_name的外键',
    trigger_group        varchar(200)    not null            comment 'qrtz_triggers表trigger_group的外键',
    str_prop_1           varchar(512)    null                comment 'String类型的trigger的第一个参数',
    str_prop_2           varchar(512)    null                comment 'String类型的trigger的第二个参数',
    str_prop_3           varchar(512)    null                comment 'String类型的trigger的第三个参数',
    int_prop_1           int             null                comment 'int类型的trigger的第一个参数',
    int_prop_2           int             null                comment 'int类型的trigger的第二个参数',
    long_prop_1          bigint          null                comment 'long类型的trigger的第一个参数',
    long_prop_2          bigint          null                comment 'long类型的trigger的第二个参数',
    dec_prop_1           numeric(13,4)   null                comment 'decimal类型的trigger的第一个参数',
    dec_prop_2           numeric(13,4)   null                comment 'decimal类型的trigger的第二个参数',
    bool_prop_1          varchar(1)      null                comment 'Boolean类型的trigger的第一个参数',
    bool_prop_2          varchar(1)      null                comment 'Boolean类型的trigger的第二个参数',
    primary key (sched_name, trigger_name, trigger_group),
    foreign key (sched_name, trigger_name, trigger_group) references QRTZ_TRIGGERS(sched_name, trigger_name, trigger_group)
) engine=innodb comment = '同步机制的行锁表';

-- ============================================
-- 系统管理表 (20张)
-- ============================================

-- 15. 部门表
DROP TABLE IF EXISTS sys_dept;
CREATE TABLE sys_dept (
  dept_id           bigint(20)      not null auto_increment    comment '部门id',
  parent_id         bigint(20)      default 0                  comment '父部门id',
  ancestors         varchar(50)     default ''                 comment '祖级列表',
  dept_name         varchar(30)     default ''                 comment '部门名称',
  order_num         int(4)          default 0                  comment '显示顺序',
  leader            varchar(20)     default null               comment '负责人',
  phone             varchar(11)     default null               comment '联系电话',
  email             varchar(50)     default null               comment '邮箱',
  status            char(1)         default '0'                comment '部门状态（0正常 1停用）',
  del_flag          char(1)         default '0'                comment '删除标志（0代表存在 2代表删除）',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  primary key (dept_id)
) engine=innodb auto_increment=200 comment = '部门表';

-- 16. 用户信息表
DROP TABLE IF EXISTS sys_user;
CREATE TABLE sys_user (
  user_id           bigint(20)      not null auto_increment    comment '用户ID',
  dept_id           bigint(20)      default null               comment '部门ID',
  user_name         varchar(30)     not null                   comment '用户账号',
  nick_name         varchar(30)     not null                   comment '用户昵称',
  user_type         varchar(2)      default '00'               comment '用户类型（00系统用户）',
  email             varchar(50)     default ''                 comment '用户邮箱',
  phonenumber       varchar(11)     default ''                 comment '手机号码',
  sex               char(1)         default '0'                comment '用户性别（0男 1女 2未知）',
  avatar            varchar(100)    default ''                 comment '头像地址',
  password          varchar(100)    default ''                 comment '密码',
  status            char(1)         default '0'                comment '账号状态（0正常 1停用）',
  del_flag          char(1)         default '0'                comment '删除标志（0代表存在 2代表删除）',
  login_ip          varchar(128)    default ''                 comment '最后登录IP',
  login_date        datetime                                   comment '最后登录时间',
  pwd_update_date   datetime                                   comment '密码最后更新时间',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(500)    default null               comment '备注',
  primary key (user_id)
) engine=innodb auto_increment=100 comment = '用户信息表';

-- 17. 岗位信息表
DROP TABLE IF EXISTS sys_post;
CREATE TABLE sys_post (
  post_id       bigint(20)      not null auto_increment    comment '岗位ID',
  post_code     varchar(64)     not null                   comment '岗位编码',
  post_name     varchar(50)     not null                   comment '岗位名称',
  post_sort     int(4)          not null                   comment '显示顺序',
  status        char(1)         not null                   comment '状态（0正常 1停用）',
  create_by     varchar(64)     default ''                 comment '创建者',
  create_time   datetime                                   comment '创建时间',
  update_by     varchar(64)     default ''                 comment '更新者',
  update_time   datetime                                   comment '更新时间',
  remark        varchar(500)    default null               comment '备注',
  primary key (post_id)
) engine=innodb comment = '岗位信息表';

-- 18. 角色信息表
DROP TABLE IF EXISTS sys_role;
CREATE TABLE sys_role (
  role_id              bigint(20)      not null auto_increment    comment '角色ID',
  role_name            varchar(30)     not null                   comment '角色名称',
  role_key             varchar(100)    not null                   comment '角色权限字符串',
  role_sort            int(4)          not null                   comment '显示顺序',
  data_scope           char(1)         default '1'                comment '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
  menu_check_strictly  tinyint(1)      default 1                  comment '菜单树选择项是否关联显示',
  dept_check_strictly  tinyint(1)      default 1                  comment '部门树选择项是否关联显示',
  status               char(1)         not null                   comment '角色状态（0正常 1停用）',
  del_flag             char(1)         default '0'                comment '删除标志（0代表存在 2代表删除）',
  create_by            varchar(64)     default ''                 comment '创建者',
  create_time          datetime                                   comment '创建时间',
  update_by            varchar(64)     default ''                 comment '更新者',
  update_time          datetime                                   comment '更新时间',
  remark               varchar(500)    default null               comment '备注',
  primary key (role_id)
) engine=innodb auto_increment=100 comment = '角色信息表';

-- 19. 菜单权限表
DROP TABLE IF EXISTS sys_menu;
CREATE TABLE sys_menu (
  menu_id           bigint(20)      not null auto_increment    comment '菜单ID',
  menu_name         varchar(50)     not null                   comment '菜单名称',
  parent_id         bigint(20)      default 0                  comment '父菜单ID',
  order_num         int(4)          default 0                  comment '显示顺序',
  path              varchar(200)    default ''                 comment '路由地址',
  component         varchar(255)    default null               comment '组件路径',
  query             varchar(255)    default null               comment '路由参数',
  route_name        varchar(50)     default ''                 comment '路由名称',
  is_frame          int(1)          default 1                  comment '是否为外链（0是 1否）',
  is_cache          int(1)          default 0                  comment '是否缓存（0缓存 1不缓存）',
  menu_type         char(1)         default ''                 comment '菜单类型（M目录 C菜单 F按钮）',
  visible           char(1)         default 0                  comment '菜单状态（0显示 1隐藏）',
  status            char(1)         default 0                  comment '菜单状态（0正常 1停用）',
  perms             varchar(100)    default null               comment '权限标识',
  icon              varchar(100)    default '#'                comment '菜单图标',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(500)    default ''                 comment '备注',
  primary key (menu_id)
) engine=innodb auto_increment=2000 comment = '菜单权限表';

-- 20. 用户和角色关联表
DROP TABLE IF EXISTS sys_user_role;
CREATE TABLE sys_user_role (
  user_id   bigint(20) not null comment '用户ID',
  role_id   bigint(20) not null comment '角色ID',
  primary key(user_id, role_id)
) engine=innodb comment = '用户和角色关联表';

-- 21. 角色和菜单关联表
DROP TABLE IF EXISTS sys_role_menu;
CREATE TABLE sys_role_menu (
  role_id   bigint(20) not null comment '角色ID',
  menu_id   bigint(20) not null comment '菜单ID',
  primary key(role_id, menu_id)
) engine=innodb comment = '角色和菜单关联表';

-- 22. 角色和部门关联表
DROP TABLE IF EXISTS sys_role_dept;
CREATE TABLE sys_role_dept (
  role_id   bigint(20) not null comment '角色ID',
  dept_id   bigint(20) not null comment '部门ID',
  primary key(role_id, dept_id)
) engine=innodb comment = '角色和部门关联表';

-- 23. 用户与岗位关联表
DROP TABLE IF EXISTS sys_user_post;
CREATE TABLE sys_user_post (
  user_id   bigint(20) not null comment '用户ID',
  post_id   bigint(20) not null comment '岗位ID',
  primary key (user_id, post_id)
) engine=innodb comment = '用户与岗位关联表';

-- 24. 操作日志记录
DROP TABLE IF EXISTS sys_oper_log;
CREATE TABLE sys_oper_log (
  oper_id           bigint(20)      not null auto_increment    comment '日志主键',
  title             varchar(50)     default ''                 comment '模块标题',
  business_type     int(2)          default 0                  comment '业务类型（0其它 1新增 2修改 3删除）',
  method            varchar(200)    default ''                 comment '方法名称',
  request_method    varchar(10)     default ''                 comment '请求方式',
  operator_type     int(1)          default 0                  comment '操作类别（0其它 1后台用户 2手机端用户）',
  oper_name         varchar(50)     default ''                 comment '操作人员',
  dept_name         varchar(50)     default ''                 comment '部门名称',
  oper_url          varchar(255)    default ''                 comment '请求URL',
  oper_ip           varchar(128)    default ''                 comment '主机地址',
  oper_location     varchar(255)    default ''                 comment '操作地点',
  oper_param        varchar(2000)   default ''                 comment '请求参数',
  json_result       varchar(2000)   default ''                 comment '返回参数',
  status            int(1)          default 0                  comment '操作状态（0正常 1异常）',
  error_msg         varchar(2000)   default ''                 comment '错误消息',
  oper_time         datetime                                   comment '操作时间',
  cost_time         bigint(20)      default 0                  comment '消耗时间',
  primary key (oper_id),
  key idx_sys_oper_log_bt (business_type),
  key idx_sys_oper_log_s  (status),
  key idx_sys_oper_log_ot (oper_time)
) engine=innodb auto_increment=100 comment = '操作日志记录';

-- 25. 字典类型表
DROP TABLE IF EXISTS sys_dict_type;
CREATE TABLE sys_dict_type (
  dict_id          bigint(20)      not null auto_increment    comment '字典主键',
  dict_name        varchar(100)    default ''                 comment '字典名称',
  dict_type        varchar(100)    default ''                 comment '字典类型',
  status           char(1)         default '0'                comment '状态（0正常 1停用）',
  create_by        varchar(64)     default ''                 comment '创建者',
  create_time      datetime                                   comment '创建时间',
  update_by        varchar(64)     default ''                 comment '更新者',
  update_time      datetime                                   comment '更新时间',
  remark           varchar(500)    default null               comment '备注',
  primary key (dict_id),
  unique (dict_type)
) engine=innodb auto_increment=100 comment = '字典类型表';

-- 26. 字典数据表
DROP TABLE IF EXISTS sys_dict_data;
CREATE TABLE sys_dict_data (
  dict_code        bigint(20)      not null auto_increment    comment '字典编码',
  dict_sort        int(4)          default 0                  comment '字典排序',
  dict_label       varchar(100)    default ''                 comment '字典标签',
  dict_value       varchar(100)    default ''                 comment '字典键值',
  dict_type        varchar(100)    default ''                 comment '字典类型',
  css_class        varchar(100)    default null               comment '样式属性（其他样式扩展）',
  list_class       varchar(100)    default null               comment '表格回显样式',
  is_default       char(1)         default 'N'                comment '是否默认（Y是 N否）',
  status           char(1)         default '0'                comment '状态（0正常 1停用）',
  create_by        varchar(64)     default ''                 comment '创建者',
  create_time      datetime                                   comment '创建时间',
  update_by        varchar(64)     default ''                 comment '更新者',
  update_time      datetime                                   comment '更新时间',
  remark           varchar(500)    default null               comment '备注',
  primary key (dict_code)
) engine=innodb auto_increment=100 comment = '字典数据表';

-- 27. 参数配置表
DROP TABLE IF EXISTS sys_config;
CREATE TABLE sys_config (
  config_id         int(5)          not null auto_increment    comment '参数主键',
  config_name       varchar(100)    default ''                 comment '参数名称',
  config_key        varchar(100)    default ''                 comment '参数键名',
  config_value      varchar(500)    default ''                 comment '参数键值',
  config_type       char(1)         default 'N'                comment '系统内置（Y是 N否）',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(500)    default null               comment '备注',
  primary key (config_id)
) engine=innodb auto_increment=100 comment = '参数配置表';

-- 28. 系统访问记录
DROP TABLE IF EXISTS sys_logininfor;
CREATE TABLE sys_logininfor (
  info_id        bigint(20)     not null auto_increment   comment '访问ID',
  user_name      varchar(50)    default ''                comment '用户账号',
  ipaddr         varchar(128)   default ''                comment '登录IP地址',
  login_location varchar(255)   default ''                comment '登录地点',
  browser        varchar(50)    default ''                comment '浏览器类型',
  os             varchar(50)    default ''                comment '操作系统',
  status         char(1)        default '0'               comment '登录状态（0成功 1失败）',
  msg            varchar(255)   default ''                comment '提示消息',
  login_time     datetime                                 comment '访问时间',
  primary key (info_id),
  key idx_sys_logininfor_s  (status),
  key idx_sys_logininfor_lt (login_time)
) engine=innodb auto_increment=100 comment = '系统访问记录';

-- 29. 定时任务调度表
DROP TABLE IF EXISTS sys_job;
CREATE TABLE sys_job (
  job_id              bigint(20)    not null auto_increment    comment '任务ID',
  job_name            varchar(64)   default ''                 comment '任务名称',
  job_group           varchar(64)   default 'DEFAULT'          comment '任务组名',
  invoke_target       varchar(500)  not null                   comment '调用目标字符串',
  cron_expression     varchar(255)  default ''                 comment 'cron执行表达式',
  misfire_policy      varchar(20)   default '3'                comment '计划执行错误策略（1立即执行 2执行一次 3放弃执行）',
  concurrent          char(1)       default '1'                comment '是否并发执行（0允许 1禁止）',
  status              char(1)       default '0'                comment '状态（0正常 1暂停）',
  create_by           varchar(64)   default ''                 comment '创建者',
  create_time         datetime                                 comment '创建时间',
  update_by           varchar(64)   default ''                 comment '更新者',
  update_time         datetime                                 comment '更新时间',
  remark              varchar(500)  default ''                 comment '备注信息',
  primary key (job_id, job_name, job_group)
) engine=innodb auto_increment=100 comment = '定时任务调度表';

-- 30. 定时任务调度日志表
DROP TABLE IF EXISTS sys_job_log;
CREATE TABLE sys_job_log (
  job_log_id          bigint(20)     not null auto_increment    comment '任务日志ID',
  job_name            varchar(64)    not null                   comment '任务名称',
  job_group           varchar(64)    not null                   comment '任务组名',
  invoke_target       varchar(500)   not null                   comment '调用目标字符串',
  job_message         varchar(500)                              comment '日志信息',
  status              char(1)        default '0'                comment '执行状态（0正常 1失败）',
  exception_info      varchar(2000)  default ''                 comment '异常信息',
  start_time          datetime                                  comment '执行开始时间',
  end_time            datetime                                  comment '执行结束时间',
  create_time         datetime                                  comment '创建时间',
  primary key (job_log_id)
) engine=innodb comment = '定时任务调度日志表';

-- 31. 通知公告表
DROP TABLE IF EXISTS sys_notice;
CREATE TABLE sys_notice (
  notice_id         int(4)          not null auto_increment    comment '公告ID',
  notice_title      varchar(50)     not null                   comment '公告标题',
  notice_type       char(1)         not null                   comment '公告类型（1通知 2公告）',
  notice_content    longblob        default null               comment '公告内容',
  status            char(1)         default '0'                comment '公告状态（0正常 1关闭）',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(255)    default null               comment '备注',
  primary key (notice_id)
) engine=innodb auto_increment=10 comment = '通知公告表';

-- 32. 公告已读记录表
DROP TABLE IF EXISTS sys_notice_read;
CREATE TABLE sys_notice_read (
  read_id          bigint(20)       not null auto_increment    comment '已读主键',
  notice_id        int(4)           not null                   comment '公告id',
  user_id          bigint(20)       not null                   comment '用户id',
  read_time        datetime         not null                   comment '阅读时间',
  primary key (read_id),
  unique key uk_user_notice (user_id, notice_id)   comment '同一用户同一公告只记录一次'
) engine=innodb auto_increment=1 comment='公告已读记录表';

-- 33. 代码生成业务表
DROP TABLE IF EXISTS gen_table;
CREATE TABLE gen_table (
  table_id          bigint(20)      not null auto_increment    comment '编号',
  table_name        varchar(200)    default ''                 comment '表名称',
  table_comment     varchar(500)    default ''                 comment '表描述',
  sub_table_name    varchar(64)     default null               comment '关联子表的表名',
  sub_table_fk_name varchar(64)     default null               comment '子表关联的外键名',
  class_name        varchar(100)    default ''                 comment '实体类名称',
  tpl_category      varchar(200)    default 'crud'             comment '使用的模板（crud单表操作 tree树表操作）',
  tpl_web_type      varchar(30)     default ''                 comment '前端模板类型（element-ui模版 element-plus模版）',
  package_name      varchar(100)                               comment '生成包路径',
  module_name       varchar(30)                                comment '生成模块名',
  business_name     varchar(30)                                comment '生成业务名',
  function_name     varchar(50)                                comment '生成功能名',
  function_author   varchar(50)                                comment '生成功能作者',
  form_col_num      int(1)          default 1                  comment '表单布局（单列 双列 三列）',
  gen_type          char(1)         default '0'                comment '生成代码方式（0zip压缩包 1自定义路径）',
  gen_path          varchar(200)    default '/'                comment '生成路径（不填默认项目路径）',
  options           varchar(1000)                              comment '其它生成选项',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(500)    default null               comment '备注',
  primary key (table_id)
) engine=innodb auto_increment=1 comment = '代码生成业务表';

-- 34. 代码生成业务表字段
DROP TABLE IF EXISTS gen_table_column;
CREATE TABLE gen_table_column (
  column_id         bigint(20)      not null auto_increment    comment '编号',
  table_id          bigint(20)                                 comment '归属表编号',
  column_name       varchar(200)                               comment '列名称',
  column_comment    varchar(500)                               comment '列描述',
  column_type       varchar(100)                               comment '列类型',
  java_type         varchar(500)                               comment 'JAVA类型',
  java_field        varchar(200)                               comment 'JAVA字段名',
  is_pk             char(1)                                    comment '是否主键（1是）',
  is_increment      char(1)                                    comment '是否自增（1是）',
  is_required       char(1)                                    comment '是否必填（1是）',
  is_insert         char(1)                                    comment '是否为插入字段（1是）',
  is_edit           char(1)                                    comment '是否编辑字段（1是）',
  is_list           char(1)                                    comment '是否列表字段（1是）',
  is_query          char(1)                                    comment '是否查询字段（1是）',
  query_type        varchar(200)    default 'EQ'               comment '查询方式（等于、不等于、大于、小于、范围）',
  html_type         varchar(200)                               comment '显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件）',
  dict_type         varchar(200)    default ''                 comment '字典类型',
  sort              int                                        comment '排序',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  primary key (column_id)
) engine=innodb auto_increment=1 comment = '代码生成业务表字段';


-- ============================================
-- 第二部分：初始化数据 (DML)
-- ============================================

-- ----------------------------
-- 部门表数据
-- ----------------------------
INSERT INTO sys_dept VALUES(100,  0,   '0',          '龙信科技',   0, '龙信', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null);
INSERT INTO sys_dept VALUES(101,  100, '0,100',      '深圳总公司', 1, '龙信', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null);
INSERT INTO sys_dept VALUES(102,  100, '0,100',      '长沙分公司', 2, '龙信', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null);
INSERT INTO sys_dept VALUES(103,  101, '0,100,101',  '研发部门',   1, '龙信', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null);
INSERT INTO sys_dept VALUES(104,  101, '0,100,101',  '市场部门',   2, '龙信', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null);
INSERT INTO sys_dept VALUES(105,  101, '0,100,101',  '测试部门',   3, '龙信', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null);
INSERT INTO sys_dept VALUES(106,  101, '0,100,101',  '财务部门',   4, '龙信', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null);
INSERT INTO sys_dept VALUES(107,  101, '0,100,101',  '运维部门',   5, '龙信', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null);
INSERT INTO sys_dept VALUES(108,  102, '0,100,102',  '市场部门',   1, '龙信', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null);
INSERT INTO sys_dept VALUES(109,  102, '0,100,102',  '财务部门',   2, '龙信', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null);

-- ----------------------------
-- 岗位信息表数据
-- ----------------------------
INSERT INTO sys_post VALUES(1, 'ceo',  '董事长',    1, '0', 'admin', sysdate(), '', null, '');
INSERT INTO sys_post VALUES(2, 'se',   '项目经理',  2, '0', 'admin', sysdate(), '', null, '');
INSERT INTO sys_post VALUES(3, 'hr',   '人力资源',  3, '0', 'admin', sysdate(), '', null, '');
INSERT INTO sys_post VALUES(4, 'user', '普通员工',  4, '0', 'admin', sysdate(), '', null, '');

-- ----------------------------
-- 角色信息表数据
-- ----------------------------
INSERT INTO sys_role VALUES('1', '超级管理员',  'admin',  1, 1, 1, 1, '0', '0', 'admin', sysdate(), '', null, '超级管理员');
INSERT INTO sys_role VALUES('2', '普通角色',    'common', 2, 2, 1, 1, '0', '0', 'admin', sysdate(), '', null, '普通角色');

-- ----------------------------
-- 菜单权限表数据
-- ----------------------------
INSERT INTO sys_menu VALUES('1', '系统管理', '0', '1', 'system',           null, '', '', 1, 0, 'M', '0', '0', '', 'system',   'admin', sysdate(), '', null, '系统管理目录');
INSERT INTO sys_menu VALUES('2', '系统监控', '0', '2', 'monitor',          null, '', '', 1, 0, 'M', '0', '0', '', 'monitor',  'admin', sysdate(), '', null, '系统监控目录');
INSERT INTO sys_menu VALUES('3', '系统工具', '0', '3', 'tool',             null, '', '', 1, 0, 'M', '0', '0', '', 'tool',     'admin', sysdate(), '', null, '系统工具目录');
INSERT INTO sys_menu VALUES('4', '龙信官网', '0', '4', 'http://hicms.vip', null, '', '', 0, 0, 'M', '0', '0', '', 'guide',    'admin', sysdate(), '', null, '龙信官网地址');
INSERT INTO sys_menu VALUES('100',  '用户管理', '1',   '1', 'user',       'system/user/index',        '', '', 1, 0, 'C', '0', '0', 'system:user:list',        'user',          'admin', sysdate(), '', null, '用户管理菜单');
INSERT INTO sys_menu VALUES('101',  '角色管理', '1',   '2', 'role',       'system/role/index',        '', '', 1, 0, 'C', '0', '0', 'system:role:list',        'peoples',       'admin', sysdate(), '', null, '角色管理菜单');
INSERT INTO sys_menu VALUES('102',  '菜单管理', '1',   '3', 'menu',       'system/menu/index',        '', '', 1, 0, 'C', '0', '0', 'system:menu:list',        'tree-table',    'admin', sysdate(), '', null, '菜单管理菜单');
INSERT INTO sys_menu VALUES('103',  '部门管理', '1',   '4', 'dept',       'system/dept/index',        '', '', 1, 0, 'C', '0', '0', 'system:dept:list',        'tree',          'admin', sysdate(), '', null, '部门管理菜单');
INSERT INTO sys_menu VALUES('104',  '岗位管理', '1',   '5', 'post',       'system/post/index',        '', '', 1, 0, 'C', '0', '0', 'system:post:list',        'post',          'admin', sysdate(), '', null, '岗位管理菜单');
INSERT INTO sys_menu VALUES('105',  '字典管理', '1',   '6', 'dict',       'system/dict/index',        '', '', 1, 0, 'C', '0', '0', 'system:dict:list',        'dict',          'admin', sysdate(), '', null, '字典管理菜单');
INSERT INTO sys_menu VALUES('106',  '参数设置', '1',   '7', 'config',     'system/config/index',      '', '', 1, 0, 'C', '0', '0', 'system:config:list',      'edit',          'admin', sysdate(), '', null, '参数设置菜单');
INSERT INTO sys_menu VALUES('107',  '通知公告', '1',   '8', 'notice',     'system/notice/index',      '', '', 1, 0, 'C', '0', '0', 'system:notice:list',      'message',       'admin', sysdate(), '', null, '通知公告菜单');
INSERT INTO sys_menu VALUES('108',  '日志管理', '1',   '9', 'log',        '',                         '', '', 1, 0, 'M', '0', '0', '',                        'log',           'admin', sysdate(), '', null, '日志管理菜单');
INSERT INTO sys_menu VALUES('109',  '在线用户', '2',   '1', 'online',     'monitor/online/index',     '', '', 1, 0, 'C', '0', '0', 'monitor:online:list',     'online',        'admin', sysdate(), '', null, '在线用户菜单');
INSERT INTO sys_menu VALUES('110',  '定时任务', '2',   '2', 'job',        'monitor/job/index',        '', '', 1, 0, 'C', '0', '0', 'monitor:job:list',        'job',           'admin', sysdate(), '', null, '定时任务菜单');
INSERT INTO sys_menu VALUES('111',  '数据监控', '2',   '3', 'druid',      'monitor/druid/index',      '', '', 1, 0, 'C', '0', '0', 'monitor:druid:list',      'druid',         'admin', sysdate(), '', null, '数据监控菜单');
INSERT INTO sys_menu VALUES('112',  '服务监控', '2',   '4', 'server',     'monitor/server/index',     '', '', 1, 0, 'C', '0', '0', 'monitor:server:list',     'server',        'admin', sysdate(), '', null, '服务监控菜单');
INSERT INTO sys_menu VALUES('113',  '缓存监控', '2',   '5', 'cache',      'monitor/cache/index',      '', '', 1, 0, 'C', '0', '0', 'monitor:cache:list',      'redis',         'admin', sysdate(), '', null, '缓存监控菜单');
INSERT INTO sys_menu VALUES('114',  '缓存列表', '2',   '6', 'cacheList',  'monitor/cache/list',       '', '', 1, 0, 'C', '0', '0', 'monitor:cache:list',      'redis-list',    'admin', sysdate(), '', null, '缓存列表菜单');
INSERT INTO sys_menu VALUES('115',  '表单构建', '3',   '1', 'build',      'tool/build/index',         '', '', 1, 0, 'C', '0', '0', 'tool:build:list',         'build',         'admin', sysdate(), '', null, '表单构建菜单');
INSERT INTO sys_menu VALUES('116',  '代码生成', '3',   '2', 'gen',        'tool/gen/index',           '', '', 1, 0, 'C', '0', '0', 'tool:gen:list',           'code',          'admin', sysdate(), '', null, '代码生成菜单');
INSERT INTO sys_menu VALUES('117',  '系统接口', '3',   '3', 'swagger',    'tool/swagger/index',       '', '', 1, 0, 'C', '0', '0', 'tool:swagger:list',       'swagger',       'admin', sysdate(), '', null, '系统接口菜单');
INSERT INTO sys_menu VALUES('500',  '操作日志', '108', '1', 'operlog',    'monitor/operlog/index',    '', '', 1, 0, 'C', '0', '0', 'monitor:operlog:list',    'form',          'admin', sysdate(), '', null, '操作日志菜单');
INSERT INTO sys_menu VALUES('501',  '登录日志', '108', '2', 'logininfor', 'monitor/logininfor/index', '', '', 1, 0, 'C', '0', '0', 'monitor:logininfor:list', 'logininfor',    'admin', sysdate(), '', null, '登录日志菜单');
INSERT INTO sys_menu VALUES('1000', '用户查询', '100', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:query',          '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1001', '用户新增', '100', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:add',            '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1002', '用户修改', '100', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:edit',           '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1003', '用户删除', '100', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:remove',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1004', '用户导出', '100', '5',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:export',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1005', '用户导入', '100', '6',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:import',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1006', '重置密码', '100', '7',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:resetPwd',       '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1007', '角色查询', '101', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:query',          '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1008', '角色新增', '101', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:add',            '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1009', '角色修改', '101', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:edit',           '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1010', '角色删除', '101', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:remove',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1011', '角色导出', '101', '5',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:export',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1012', '菜单查询', '102', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:query',          '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1013', '菜单新增', '102', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:add',            '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1014', '菜单修改', '102', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:edit',           '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1015', '菜单删除', '102', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:remove',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1016', '部门查询', '103', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:query',          '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1017', '部门新增', '103', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:add',            '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1018', '部门修改', '103', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:edit',           '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1019', '部门删除', '103', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:remove',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1020', '岗位查询', '104', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:query',          '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1021', '岗位新增', '104', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:add',            '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1022', '岗位修改', '104', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:edit',           '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1023', '岗位删除', '104', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:remove',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1024', '岗位导出', '104', '5',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:export',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1025', '字典查询', '105', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:query',          '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1026', '字典新增', '105', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:add',            '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1027', '字典修改', '105', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:edit',           '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1028', '字典删除', '105', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:remove',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1029', '字典导出', '105', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:export',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1030', '参数查询', '106', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:query',        '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1031', '参数新增', '106', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:add',          '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1032', '参数修改', '106', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:edit',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1033', '参数删除', '106', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:remove',       '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1034', '参数导出', '106', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:export',       '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1035', '公告查询', '107', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:query',        '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1036', '公告新增', '107', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:add',          '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1037', '公告修改', '107', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:edit',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1038', '公告删除', '107', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:remove',       '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1039', '操作查询', '500', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:query',      '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1040', '操作删除', '500', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:remove',     '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1041', '日志导出', '500', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:export',     '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1042', '登录查询', '501', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:query',   '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1043', '登录删除', '501', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:remove',  '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1044', '日志导出', '501', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:export',  '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1045', '账户解锁', '501', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:unlock',  '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1046', '在线查询', '109', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:query',       '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1047', '批量强退', '109', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:batchLogout', '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1048', '单条强退', '109', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:forceLogout', '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1049', '任务查询', '110', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:query',          '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1050', '任务新增', '110', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:add',            '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1051', '任务修改', '110', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:edit',           '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1052', '任务删除', '110', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:remove',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1053', '状态修改', '110', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:changeStatus',   '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1054', '任务导出', '110', '6', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:export',         '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1055', '生成查询', '116', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:query',             '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1056', '生成修改', '116', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:edit',              '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1057', '生成删除', '116', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:remove',            '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1058', '导入代码', '116', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:import',            '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1059', '预览代码', '116', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:preview',           '#', 'admin', sysdate(), '', null, '');
INSERT INTO sys_menu VALUES('1060', '生成代码', '116', '6', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:code',              '#', 'admin', sysdate(), '', null, '');

-- ----------------------------
-- 用户信息表数据
-- ----------------------------
INSERT INTO sys_user VALUES(1,  103, 'admin', '龙信', '00', 'ry@163.com', '15888888888', '1', '', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '0', '0', '127.0.0.1', sysdate(), sysdate(), 'admin', sysdate(), '', null, '管理员');
INSERT INTO sys_user VALUES(2,  105, 'ry',    '龙信', '00', 'ry@qq.com',  '15666666666', '1', '', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '0', '0', '127.0.0.1', sysdate(), sysdate(), 'admin', sysdate(), '', null, '测试员');

-- ----------------------------
-- 用户和角色关联表数据
-- ----------------------------
INSERT INTO sys_user_role VALUES ('1', '1');
INSERT INTO sys_user_role VALUES ('2', '2');

-- ----------------------------
-- 角色和菜单关联表数据
-- ----------------------------
INSERT INTO sys_role_menu VALUES ('2', '1');
INSERT INTO sys_role_menu VALUES ('2', '2');
INSERT INTO sys_role_menu VALUES ('2', '3');
INSERT INTO sys_role_menu VALUES ('2', '4');
INSERT INTO sys_role_menu VALUES ('2', '100');
INSERT INTO sys_role_menu VALUES ('2', '101');
INSERT INTO sys_role_menu VALUES ('2', '102');
INSERT INTO sys_role_menu VALUES ('2', '103');
INSERT INTO sys_role_menu VALUES ('2', '104');
INSERT INTO sys_role_menu VALUES ('2', '105');
INSERT INTO sys_role_menu VALUES ('2', '106');
INSERT INTO sys_role_menu VALUES ('2', '107');
INSERT INTO sys_role_menu VALUES ('2', '108');
INSERT INTO sys_role_menu VALUES ('2', '109');
INSERT INTO sys_role_menu VALUES ('2', '110');
INSERT INTO sys_role_menu VALUES ('2', '111');
INSERT INTO sys_role_menu VALUES ('2', '112');
INSERT INTO sys_role_menu VALUES ('2', '113');
INSERT INTO sys_role_menu VALUES ('2', '114');
INSERT INTO sys_role_menu VALUES ('2', '115');
INSERT INTO sys_role_menu VALUES ('2', '116');
INSERT INTO sys_role_menu VALUES ('2', '117');
INSERT INTO sys_role_menu VALUES ('2', '500');
INSERT INTO sys_role_menu VALUES ('2', '501');
INSERT INTO sys_role_menu VALUES ('2', '1000');
INSERT INTO sys_role_menu VALUES ('2', '1001');
INSERT INTO sys_role_menu VALUES ('2', '1002');
INSERT INTO sys_role_menu VALUES ('2', '1003');
INSERT INTO sys_role_menu VALUES ('2', '1004');
INSERT INTO sys_role_menu VALUES ('2', '1005');
INSERT INTO sys_role_menu VALUES ('2', '1006');
INSERT INTO sys_role_menu VALUES ('2', '1007');
INSERT INTO sys_role_menu VALUES ('2', '1008');
INSERT INTO sys_role_menu VALUES ('2', '1009');
INSERT INTO sys_role_menu VALUES ('2', '1010');
INSERT INTO sys_role_menu VALUES ('2', '1011');
INSERT INTO sys_role_menu VALUES ('2', '1012');
INSERT INTO sys_role_menu VALUES ('2', '1013');
INSERT INTO sys_role_menu VALUES ('2', '1014');
INSERT INTO sys_role_menu VALUES ('2', '1015');
INSERT INTO sys_role_menu VALUES ('2', '1016');
INSERT INTO sys_role_menu VALUES ('2', '1017');
INSERT INTO sys_role_menu VALUES ('2', '1018');
INSERT INTO sys_role_menu VALUES ('2', '1019');
INSERT INTO sys_role_menu VALUES ('2', '1020');
INSERT INTO sys_role_menu VALUES ('2', '1021');
INSERT INTO sys_role_menu VALUES ('2', '1022');
INSERT INTO sys_role_menu VALUES ('2', '1023');
INSERT INTO sys_role_menu VALUES ('2', '1024');
INSERT INTO sys_role_menu VALUES ('2', '1025');
INSERT INTO sys_role_menu VALUES ('2', '1026');
INSERT INTO sys_role_menu VALUES ('2', '1027');
INSERT INTO sys_role_menu VALUES ('2', '1028');
INSERT INTO sys_role_menu VALUES ('2', '1029');
INSERT INTO sys_role_menu VALUES ('2', '1030');
INSERT INTO sys_role_menu VALUES ('2', '1031');
INSERT INTO sys_role_menu VALUES ('2', '1032');
INSERT INTO sys_role_menu VALUES ('2', '1033');
INSERT INTO sys_role_menu VALUES ('2', '1034');
INSERT INTO sys_role_menu VALUES ('2', '1035');
INSERT INTO sys_role_menu VALUES ('2', '1036');
INSERT INTO sys_role_menu VALUES ('2', '1037');
INSERT INTO sys_role_menu VALUES ('2', '1038');
INSERT INTO sys_role_menu VALUES ('2', '1039');
INSERT INTO sys_role_menu VALUES ('2', '1040');
INSERT INTO sys_role_menu VALUES ('2', '1041');
INSERT INTO sys_role_menu VALUES ('2', '1042');
INSERT INTO sys_role_menu VALUES ('2', '1043');
INSERT INTO sys_role_menu VALUES ('2', '1044');
INSERT INTO sys_role_menu VALUES ('2', '1045');
INSERT INTO sys_role_menu VALUES ('2', '1046');
INSERT INTO sys_role_menu VALUES ('2', '1047');
INSERT INTO sys_role_menu VALUES ('2', '1048');
INSERT INTO sys_role_menu VALUES ('2', '1049');
INSERT INTO sys_role_menu VALUES ('2', '1050');
INSERT INTO sys_role_menu VALUES ('2', '1051');
INSERT INTO sys_role_menu VALUES ('2', '1052');
INSERT INTO sys_role_menu VALUES ('2', '1053');
INSERT INTO sys_role_menu VALUES ('2', '1054');
INSERT INTO sys_role_menu VALUES ('2', '1055');
INSERT INTO sys_role_menu VALUES ('2', '1056');
INSERT INTO sys_role_menu VALUES ('2', '1057');
INSERT INTO sys_role_menu VALUES ('2', '1058');
INSERT INTO sys_role_menu VALUES ('2', '1059');
INSERT INTO sys_role_menu VALUES ('2', '1060');

-- ----------------------------
-- 角色和部门关联表数据
-- ----------------------------
INSERT INTO sys_role_dept VALUES ('2', '100');
INSERT INTO sys_role_dept VALUES ('2', '101');
INSERT INTO sys_role_dept VALUES ('2', '105');

-- ----------------------------
-- 用户与岗位关联表数据
-- ----------------------------
INSERT INTO sys_user_post VALUES ('1', '1');
INSERT INTO sys_user_post VALUES ('2', '2');

-- ----------------------------
-- 字典类型表数据
-- ----------------------------
INSERT INTO sys_dict_type VALUES(1,  '用户性别', 'sys_user_sex',        '0', 'admin', sysdate(), '', null, '用户性别列表');
INSERT INTO sys_dict_type VALUES(2,  '菜单状态', 'sys_show_hide',       '0', 'admin', sysdate(), '', null, '菜单状态列表');
INSERT INTO sys_dict_type VALUES(3,  '系统开关', 'sys_normal_disable',  '0', 'admin', sysdate(), '', null, '系统开关列表');
INSERT INTO sys_dict_type VALUES(4,  '任务状态', 'sys_job_status',      '0', 'admin', sysdate(), '', null, '任务状态列表');
INSERT INTO sys_dict_type VALUES(5,  '任务分组', 'sys_job_group',       '0', 'admin', sysdate(), '', null, '任务分组列表');
INSERT INTO sys_dict_type VALUES(6,  '系统是否', 'sys_yes_no',          '0', 'admin', sysdate(), '', null, '系统是否列表');
INSERT INTO sys_dict_type VALUES(7,  '通知类型', 'sys_notice_type',     '0', 'admin', sysdate(), '', null, '通知类型列表');
INSERT INTO sys_dict_type VALUES(8,  '通知状态', 'sys_notice_status',   '0', 'admin', sysdate(), '', null, '通知状态列表');
INSERT INTO sys_dict_type VALUES(9,  '操作类型', 'sys_oper_type',       '0', 'admin', sysdate(), '', null, '操作类型列表');
INSERT INTO sys_dict_type VALUES(10, '系统状态', 'sys_common_status',   '0', 'admin', sysdate(), '', null, '登录状态列表');

-- ----------------------------
-- 字典数据表数据
-- ----------------------------
INSERT INTO sys_dict_data VALUES(1,  1,  '男',       '0',       'sys_user_sex',        '',   '',        'Y', '0', 'admin', sysdate(), '', null, '性别男');
INSERT INTO sys_dict_data VALUES(2,  2,  '女',       '1',       'sys_user_sex',        '',   '',        'N', '0', 'admin', sysdate(), '', null, '性别女');
INSERT INTO sys_dict_data VALUES(3,  3,  '未知',     '2',       'sys_user_sex',        '',   '',        'N', '0', 'admin', sysdate(), '', null, '性别未知');
INSERT INTO sys_dict_data VALUES(4,  1,  '显示',     '0',       'sys_show_hide',       '',   'primary', 'Y', '0', 'admin', sysdate(), '', null, '显示菜单');
INSERT INTO sys_dict_data VALUES(5,  2,  '隐藏',     '1',       'sys_show_hide',       '',   'danger',  'N', '0', 'admin', sysdate(), '', null, '隐藏菜单');
INSERT INTO sys_dict_data VALUES(6,  1,  '正常',     '0',       'sys_normal_disable',  '',   'primary', 'Y', '0', 'admin', sysdate(), '', null, '正常状态');
INSERT INTO sys_dict_data VALUES(7,  2,  '停用',     '1',       'sys_normal_disable',  '',   'danger',  'N', '0', 'admin', sysdate(), '', null, '停用状态');
INSERT INTO sys_dict_data VALUES(8,  1,  '正常',     '0',       'sys_job_status',      '',   'primary', 'Y', '0', 'admin', sysdate(), '', null, '正常状态');
INSERT INTO sys_dict_data VALUES(9,  2,  '暂停',     '1',       'sys_job_status',      '',   'danger',  'N', '0', 'admin', sysdate(), '', null, '停用状态');
INSERT INTO sys_dict_data VALUES(10, 1,  '默认',     'DEFAULT', 'sys_job_group',       '',   '',        'Y', '0', 'admin', sysdate(), '', null, '默认分组');
INSERT INTO sys_dict_data VALUES(11, 2,  '系统',     'SYSTEM',  'sys_job_group',       '',   '',        'N', '0', 'admin', sysdate(), '', null, '系统分组');
INSERT INTO sys_dict_data VALUES(12, 1,  '是',       'Y',       'sys_yes_no',          '',   'primary', 'Y', '0', 'admin', sysdate(), '', null, '系统默认是');
INSERT INTO sys_dict_data VALUES(13, 2,  '否',       'N',       'sys_yes_no',          '',   'danger',  'N', '0', 'admin', sysdate(), '', null, '系统默认否');
INSERT INTO sys_dict_data VALUES(14, 1,  '通知',     '1',       'sys_notice_type',     '',   'warning', 'Y', '0', 'admin', sysdate(), '', null, '通知');
INSERT INTO sys_dict_data VALUES(15, 2,  '公告',     '2',       'sys_notice_type',     '',   'success', 'N', '0', 'admin', sysdate(), '', null, '公告');
INSERT INTO sys_dict_data VALUES(16, 1,  '正常',     '0',       'sys_notice_status',   '',   'primary', 'Y', '0', 'admin', sysdate(), '', null, '正常状态');
INSERT INTO sys_dict_data VALUES(17, 2,  '关闭',     '1',       'sys_notice_status',   '',   'danger',  'N', '0', 'admin', sysdate(), '', null, '关闭状态');
INSERT INTO sys_dict_data VALUES(18, 99, '其他',     '0',       'sys_oper_type',       '',   'info',    'N', '0', 'admin', sysdate(), '', null, '其他操作');
INSERT INTO sys_dict_data VALUES(19, 1,  '新增',     '1',       'sys_oper_type',       '',   'info',    'N', '0', 'admin', sysdate(), '', null, '新增操作');
INSERT INTO sys_dict_data VALUES(20, 2,  '修改',     '2',       'sys_oper_type',       '',   'info',    'N', '0', 'admin', sysdate(), '', null, '修改操作');
INSERT INTO sys_dict_data VALUES(21, 3,  '删除',     '3',       'sys_oper_type',       '',   'danger',  'N', '0', 'admin', sysdate(), '', null, '删除操作');
INSERT INTO sys_dict_data VALUES(22, 4,  '授权',     '4',       'sys_oper_type',       '',   'primary', 'N', '0', 'admin', sysdate(), '', null, '授权操作');
INSERT INTO sys_dict_data VALUES(23, 5,  '导出',     '5',       'sys_oper_type',       '',   'warning', 'N', '0', 'admin', sysdate(), '', null, '导出操作');
INSERT INTO sys_dict_data VALUES(24, 6,  '导入',     '6',       'sys_oper_type',       '',   'warning', 'N', '0', 'admin', sysdate(), '', null, '导入操作');
INSERT INTO sys_dict_data VALUES(25, 7,  '强退',     '7',       'sys_oper_type',       '',   'danger',  'N', '0', 'admin', sysdate(), '', null, '强退操作');
INSERT INTO sys_dict_data VALUES(26, 8,  '生成代码', '8',       'sys_oper_type',       '',   'warning', 'N', '0', 'admin', sysdate(), '', null, '生成操作');
INSERT INTO sys_dict_data VALUES(27, 9,  '清空数据', '9',       'sys_oper_type',       '',   'danger',  'N', '0', 'admin', sysdate(), '', null, '清空操作');
INSERT INTO sys_dict_data VALUES(28, 1,  '成功',     '0',       'sys_common_status',   '',   'primary', 'N', '0', 'admin', sysdate(), '', null, '正常状态');
INSERT INTO sys_dict_data VALUES(29, 2,  '失败',     '1',       'sys_common_status',   '',   'danger',  'N', '0', 'admin', sysdate(), '', null, '停用状态');

-- ----------------------------
-- 参数配置表数据
-- ----------------------------
INSERT INTO sys_config VALUES(1, '主框架页-默认皮肤样式名称',     'sys.index.skinName',               'skin-blue',     'Y', 'admin', sysdate(), '', null, '蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow' );
INSERT INTO sys_config VALUES(2, '用户管理-账号初始密码',         'sys.user.initPassword',            '123456',        'Y', 'admin', sysdate(), '', null, '初始化密码 123456' );
INSERT INTO sys_config VALUES(3, '主框架页-侧边栏主题',           'sys.index.sideTheme',              'theme-dark',    'Y', 'admin', sysdate(), '', null, '深色主题theme-dark，浅色主题theme-light' );
INSERT INTO sys_config VALUES(4, '账号自助-验证码开关',           'sys.account.captchaEnabled',       'true',          'Y', 'admin', sysdate(), '', null, '是否开启验证码功能（true开启，false关闭）');
INSERT INTO sys_config VALUES(5, '账号自助-是否开启用户注册功能', 'sys.account.registerUser',         'false',         'Y', 'admin', sysdate(), '', null, '是否开启注册用户功能（true开启，false关闭）');
INSERT INTO sys_config VALUES(6, '用户登录-黑名单列表',           'sys.login.blackIPList',            '',              'Y', 'admin', sysdate(), '', null, '设置登录IP黑名单限制，多个匹配项以;分隔，支持匹配（*通配、网段）');
INSERT INTO sys_config VALUES(7, '用户管理-初始密码修改策略',     'sys.account.initPasswordModify',   '1',             'Y', 'admin', sysdate(), '', null, '0：初始密码修改策略关闭，没有任何提示，1：提醒用户，如果未修改初始密码，则在登录时就会提醒修改密码对话框');
INSERT INTO sys_config VALUES(8, '用户管理-账号密码更新周期',     'sys.account.passwordValidateDays', '0',             'Y', 'admin', sysdate(), '', null, '密码更新周期（填写数字，数据初始化值为0不限制，若修改必须为大于0小于365的正整数），如果超过这个周期登录系统时，则在登录时就会提醒修改密码对话框');
INSERT INTO sys_config VALUES(9, '用户管理-密码字符范围',         'sys.account.chrtype',              '0',             'Y', 'admin', sysdate(), '', null, '默认任意字符范围，0任意（密码可以输入任意字符），1数字（密码只能为0-9数字），2英文字母（密码只能为a-z和A-Z字母），3字母和数字（密码必须包含字母，数字）,4字母数字和特殊字符（目前支持的特殊字符包括：~!@#$%^&*()-=_+）');

-- ----------------------------
-- 定时任务调度表数据
-- ----------------------------
INSERT INTO sys_job VALUES(1, '系统默认（无参）', 'DEFAULT', 'ryTask.ryNoParams',        '0/10 * * * * ?', '3', '1', '1', 'admin', sysdate(), '', null, '');
INSERT INTO sys_job VALUES(2, '系统默认（有参）', 'DEFAULT', 'ryTask.ryParams(\'ry\')',  '0/15 * * * * ?', '3', '1', '1', 'admin', sysdate(), '', null, '');
INSERT INTO sys_job VALUES(3, '系统默认（多参）', 'DEFAULT', 'ryTask.ryMultipleParams(\'ry\', true, 2000L, 316.50D, 100)',  '0/20 * * * * ?', '3', '1', '1', 'admin', sysdate(), '', null, '');

-- ----------------------------
-- 通知公告表数据
-- ----------------------------
INSERT INTO sys_notice VALUES('1', '温馨提醒：2026-07-01 龙信新版本发布啦', '2', '新版本内容', '0', 'admin', sysdate(), '', null, '管理员');
INSERT INTO sys_notice VALUES('2', '维护通知：2026-07-01 龙信系统凌晨维护', '1', '维护内容',   '0', 'admin', sysdate(), '', null, '管理员');

-- ----------------------------
-- 通讯录成员表数据
-- ----------------------------
INSERT INTO meeting_member (user_id, user_name, phone, wechat, email, department, duty_date, is_miniapp_auth, is_info_center, is_jiyao_bureau, is_meeting_organizer, is_current_duty, create_by, create_time, remark) VALUES
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

-- ----------------------------
-- 会议室表数据（生产环境）
-- ----------------------------
TRUNCATE TABLE meeting_room;
INSERT INTO meeting_room (name, normal_capacity, covid_capacity, applicable_scope, layout, area_size, image_url, booking_json, create_by, create_time, remark) VALUES
('617会议室', 82, 50, '常务会、专题会、好信云视频会', '圆桌形式', '236.16m²', 'http://localhost:8088/rooms/617.png', '[]', 'admin', NOW(), NULL),
('618会议室', 25, 15, '外事活动', '会见沙发', '87.18m²', 'http://localhost:8088/rooms/618.png', '[]', 'admin', NOW(), NULL),
('615会议室', 19, 8, '小型会议', '圆桌形式', '52m²', 'http://localhost:8088/rooms/615.png', '[]', 'admin', NOW(), NULL),
('511会议室', 35, 20, '正常会议', '圆桌形式', '81.5m²', 'http://localhost:8088/rooms/511.png', '[]', 'admin', NOW(), NULL),
('411会议室', 30, 20, '正常会议', '圆桌形式', '88.9m²', 'http://localhost:8088/rooms/411.png', '[]', 'admin', NOW(), NULL),
('413会议室', 20, 15, '外事活动', '会见沙发', '98.26m²', 'http://localhost:8088/rooms/413.png', '[]', 'admin', NOW(), NULL),
('701会议室', 14, 6, '七楼参会领导候会', '会见沙发', '73.08m²', 'http://localhost:8088/rooms/701.png', '[]', 'admin', NOW(), NULL),
('702会议室', 56, 35, '涉密视频会、正常会议', '课桌形式', '131.88m²', 'http://localhost:8088/rooms/702.png', '[]', 'admin', NOW(), NULL),
('703会议室', 35, 20, '视频会分会场，正常会议', '圆桌形式', '73.63m²', 'http://localhost:8088/rooms/703.png', '[]', 'admin', NOW(), NULL),
('707会议室', 35, 20, '正常会议', '圆桌形式', '57.49m²', 'http://localhost:8088/rooms/707.png', '[]', 'admin', NOW(), NULL);

-- ----------------------------
-- 会议预定模拟数据
-- ----------------------------
TRUNCATE TABLE meeting_book;
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '张三', 2, '周例会', '李局长', '2026-06-29 09:00:00', '2026-06-29 10:30:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '李四', 3, '项目评审', '王副局长', '2026-06-29 14:00:00', '2026-06-29 16:00:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '王五', 4, '安全生产会', '赵书记', '2026-06-30 08:30:00', '2026-06-30 10:00:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '赵六', 5, '', '陈主任', '2026-06-30 15:00:00', '2026-06-30 16:00:00', '1', '1', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '张三', 2, '月度总结', '李局长', '2026-07-01 09:00:00', '2026-07-01 11:00:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '李四', 3, '接待汇报', '王副局长', '2026-07-02 10:00:00', '2026-07-02 11:00:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '王五', 4, '', '', '2026-07-02 14:00:00', '2026-07-02 15:30:00', '1', '0', '0', '1', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '赵六', 5, '党建学习', '赵书记', '2026-07-03 09:00:00', '2026-07-03 10:00:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '张三', 2, '视频调度会', '李局长', '2026-07-03 14:00:00', '2026-07-03 15:00:00', '1', '1', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '李四', 3, '投资洽谈', '王副局长', '2026-07-06 09:00:00', '2026-07-06 10:30:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '王五', 4, '', '陈主任', '2026-07-06 11:30:00', '2026-07-06 12:30:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '赵六', 5, '机要专线会', '', '2026-07-06 15:00:00', '2026-07-06 16:00:00', '1', '0', '1', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '张三', 2, '周例会', '李局长', '2026-07-07 08:30:00', '2026-07-07 10:00:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '李四', 3, '好信云视频会', '', '2026-07-07 14:00:00', '2026-07-07 15:30:00', '1', '1', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '王五', 4, '专题研讨会', '赵书记', '2026-07-08 10:00:00', '2026-07-08 12:00:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '赵六', 5, '', '王副局长', '2026-07-08 15:00:00', '2026-07-08 16:30:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '张三', 2, '国办连线', '', '2026-07-09 09:00:00', '2026-07-09 10:00:00', '1', '0', '0', '1', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '李四', 3, '总结会', '李局长', '2026-07-10 08:00:00', '2026-07-10 09:00:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '赵六', 5, '周例会', '李局长', '2026-07-13 09:00:00', '2026-07-13 10:30:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '张三', 2, '', '王副局长', '2026-07-13 14:00:00', '2026-07-13 15:00:00', '0', '0', '0', '0', '0', '0', 'admin');
INSERT INTO meeting_book (room_name, room_id, booker_name, booker_id, meeting_name, leader_name, meeting_start_time, meeting_end_time, is_online, is_hxy, is_jyj_line, is_gb_line, is_canceled, is_finished, create_by)
VALUES ('617会议室', 1, '王五', 4, '安全检查', '赵书记', '2026-07-14 10:00:00', '2026-07-14 11:00:00', '0', '0', '0', '0', '0', '0', 'admin');