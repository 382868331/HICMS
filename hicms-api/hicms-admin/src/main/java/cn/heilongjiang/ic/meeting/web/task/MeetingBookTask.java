package cn.heilongjiang.ic.meeting.web.task;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import cn.heilongjiang.ic.meeting.meeting.service.IMeetingBookService;

/**
 * 会议预定定时任务
 *
 * @author hicms
 */
@Component
public class MeetingBookTask
{
    private static final Logger log = LoggerFactory.getLogger(MeetingBookTask.class);

    @Autowired
    private IMeetingBookService meetingBookService;

    /**
     * 每小时执行一次：将已过开始时间的未结束、未取消会议标记为已结束
     * cron: 每小时整点执行
     */
    @Scheduled(cron = "0 0 * * * ?")
    public void updateOverdueMeetings()
    {
        log.info("开始执行定时任务：标记已过期会议为已结束");
        try
        {
            int rows = meetingBookService.updateOverdueMeetings();
            log.info("定时任务完成：标记了 {} 条过期会议为已结束", rows);
        }
        catch (Exception e)
        {
            log.error("定时任务执行失败：标记已过期会议为已结束", e);
        }
    }
}
