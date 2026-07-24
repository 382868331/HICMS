package cn.heilongjiang.ic.meeting.common.utils;

import com.github.pagehelper.PageHelper;
import cn.heilongjiang.ic.meeting.common.core.page.PageDomain;
import cn.heilongjiang.ic.meeting.common.core.page.TableSupport;
import cn.heilongjiang.ic.meeting.common.utils.sql.SqlUtil;

/**
 * 分页工具?
 * 
 * @author hicms
 */
public class PageUtils extends PageHelper
{
    /**
     * 设置请求分页数据
     */
    public static void startPage()
    {
        PageDomain pageDomain = TableSupport.buildPageRequest();
        Integer pageNum = pageDomain.getPageNum();
        Integer pageSize = pageDomain.getPageSize();
        String orderBy = SqlUtil.escapeOrderBySql(pageDomain.getOrderBy());
        Boolean reasonable = pageDomain.getReasonable();
        PageHelper.startPage(pageNum, pageSize, orderBy).setReasonable(reasonable);
    }

    /**
     * 清理分页的线程变?
     */
    public static void clearPage()
    {
        PageHelper.clearPage();
    }
}
