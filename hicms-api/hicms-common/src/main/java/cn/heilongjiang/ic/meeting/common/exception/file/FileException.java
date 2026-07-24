package cn.heilongjiang.ic.meeting.common.exception.file;

import cn.heilongjiang.ic.meeting.common.exception.base.BaseException;

/**
 * 文件信息异常?
 * 
 * @author hicms
 */
public class FileException extends BaseException
{
    private static final long serialVersionUID = 1L;

    public FileException(String code, Object[] args)
    {
        super("file", code, args, null);
    }

}
