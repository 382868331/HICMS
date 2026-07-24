package cn.heilongjiang.ic.meeting.quartz.util;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import cn.heilongjiang.ic.meeting.quartz.domain.SysJob;

/**
 * 定时任务处理（禁止并发执行）
 * 
 * @author hicms
 *
 */
@DisallowConcurrentExecution
public class QuartzDisallowConcurrentExecution extends AbstractQuartzJob
{
    @Override
    protected void doExecute(JobExecutionContext context, SysJob sysJob) throws Exception
    {
        JobInvokeUtil.invokeMethod(sysJob);
    }
}
