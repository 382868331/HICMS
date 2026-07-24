package cn.heilongjiang.ic.meeting.common.utils;

/**
 * 处理并记录日志文?
 * 
 * @author hicms
 */
public class LogUtils
{
    public static String getBlock(Object msg)
    {
        if (msg == null)
        {
            msg = "";
        }
        return "[" + msg.toString() + "]";
    }
}
