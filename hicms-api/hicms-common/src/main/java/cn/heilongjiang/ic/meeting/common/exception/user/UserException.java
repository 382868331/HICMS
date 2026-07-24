package cn.heilongjiang.ic.meeting.common.exception.user;

import cn.heilongjiang.ic.meeting.common.exception.base.BaseException;

/**
 * 用户信息异常?
 * 
 * @author hicms
 */
public class UserException extends BaseException
{
    private static final long serialVersionUID = 1L;

    public UserException(String code, Object[] args)
    {
        super("user", code, args, null);
    }
}
