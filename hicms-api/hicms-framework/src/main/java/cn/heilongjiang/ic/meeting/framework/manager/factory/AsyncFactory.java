package cn.heilongjiang.ic.meeting.framework.manager.factory;

import java.util.TimerTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import cn.heilongjiang.ic.meeting.common.constant.Constants;
import cn.heilongjiang.ic.meeting.common.utils.LogUtils;
import cn.heilongjiang.ic.meeting.common.utils.ServletUtils;
import cn.heilongjiang.ic.meeting.common.utils.StringUtils;
import cn.heilongjiang.ic.meeting.common.utils.http.UserAgentUtils;
import cn.heilongjiang.ic.meeting.common.utils.ip.AddressUtils;
import cn.heilongjiang.ic.meeting.common.utils.ip.IpUtils;
import cn.heilongjiang.ic.meeting.common.utils.spring.SpringUtils;
import cn.heilongjiang.ic.meeting.system.domain.SysLogininfor;
import cn.heilongjiang.ic.meeting.system.domain.SysOperLog;
import cn.heilongjiang.ic.meeting.system.service.ISysLogininforService;
import cn.heilongjiang.ic.meeting.system.service.ISysOperLogService;

/**
 * 异步工厂（产生任务用?
 * 
 * @author hicms
 */
public class AsyncFactory
{
    private static final Logger sys_user_logger = LoggerFactory.getLogger("sys-user");

    /**
     * 记录登录信息
     * 
     * @param username 用户?
     * @param status 状?
     * @param message 消息
     * @param args 列表
     * @return 任务task
     */
    public static TimerTask recordLogininfor(final String username, final String status, final String message,
            final Object... args)
    {
        final String userAgent = ServletUtils.getRequest().getHeader("User-Agent");
        final String ip = IpUtils.getIpAddr();
        return new TimerTask()
        {
            @Override
            public void run()
            {
                String address = AddressUtils.getRealAddressByIP(ip);
                StringBuilder s = new StringBuilder();
                s.append(LogUtils.getBlock(ip));
                s.append(address);
                s.append(LogUtils.getBlock(username));
                s.append(LogUtils.getBlock(status));
                s.append(LogUtils.getBlock(message));
                // 打印信息到日?
                sys_user_logger.info(s.toString(), args);
                // 获取客户端操作系?
                String os = UserAgentUtils.getOperatingSystem(userAgent);
                // 获取客户端浏览器
                String browser = UserAgentUtils.getBrowser(userAgent);
                // 封装对象
                SysLogininfor logininfor = new SysLogininfor();
                logininfor.setUserName(username);
                logininfor.setIpaddr(ip);
                logininfor.setLoginLocation(address);
                logininfor.setBrowser(browser);
                logininfor.setOs(os);
                logininfor.setMsg(message);
                // 日志状?
                if (StringUtils.equalsAny(status, Constants.LOGIN_SUCCESS, Constants.LOGOUT, Constants.REGISTER))
                {
                    logininfor.setStatus(Constants.SUCCESS);
                }
                else if (Constants.LOGIN_FAIL.equals(status))
                {
                    logininfor.setStatus(Constants.FAIL);
                }
                // 插入数据
                SpringUtils.getBean(ISysLogininforService.class).insertLogininfor(logininfor);
            }
        };
    }

    /**
     * 操作日志记录
     * 
     * @param operLog 操作日志信息
     * @return 任务task
     */
    public static TimerTask recordOper(final SysOperLog operLog)
    {
        return new TimerTask()
        {
            @Override
            public void run()
            {
                // 远程查询操作地点
                operLog.setOperLocation(AddressUtils.getRealAddressByIP(operLog.getOperIp()));
                SpringUtils.getBean(ISysOperLogService.class).insertOperlog(operLog);
            }
        };
    }
}
