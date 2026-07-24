package cn.heilongjiang.ic.meeting.common.utils;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import cn.heilongjiang.ic.meeting.common.utils.spring.SpringUtils;

/**
 * 获取i18n资源文件
 * 
 * @author hicms
 */
public class MessageUtils
{
    /**
     * 根据消息键和参数 获取消息 委托给spring messageSource
     *
     * @param code 消息?
     * @param args 参数
     * @return 获取国际化翻译?
     */
    public static String message(String code, Object... args)
    {
        MessageSource messageSource = SpringUtils.getBean(MessageSource.class);
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }
}
