package demo
import (
	"github.com/gin-gonic/gin"
	//"net/http"
	//"fmt"
	//"go-antd-admin/utils/result"
	//"go-antd-admin/utils/e"
	"go-antd-admin/models"
	//"encoding/json"
	//"strconv"
	"net/http"
	"time"
	//"go-antd-admin/middleware/jwt"
)
func Index(c *gin.Context) {
	c.String(200, "Hello World2")
}

var menuModel = new(models.Menu)
// @Summary 注册用户
// @Produce  json
// @Param name query string true "name"
// @Param pwd query string true "password"
// @Success 200 {object} result.Response
// @Failure 500 {object} result.Response
// @Router /register [get]
// 注册信息



type OfflineChartData struct{
	X int
	Y1 int
	Y2 int
}
type SalesData struct{
	X string
	Y int
}
type ChartData struct{
	OfflineChartData OfflineChartData
	SalesData []*SalesData
}
func Fake_chart_data(c *gin.Context){
	data:=&ChartData{}
	data.OfflineChartData.X=155934896
	data.OfflineChartData.Y1=79
	data.OfflineChartData.Y2=68
	salesData:=&SalesData{X:"1月",Y:997}
	//data.SalesData=[]*SalesData{}
	data.SalesData=append(data.SalesData,salesData)
	salesData2:=&SalesData{X:"2月",Y:479}
	salesData3:=&SalesData{X:"3月",Y:339}
	data.SalesData=append(data.SalesData,salesData2)
	data.SalesData=append(data.SalesData,salesData3)
	//result.SuccessWithData(c,e.GetMsg(e.SUCCESS),data)
	c.JSON(http.StatusOK,data)
}
type Activitie struct{
	Id string `json:"id"`
	Template string `json:"template"`
	UpdatedAt string `json:"updatedAt"`
	User User `json:"user"`
	Group Group `json:"group"`
	Project Project `json:"project"`
}
type User struct{
	Name string `json:"name"`
	Avatar string `json:"avatar"`
}
type Group struct{
	Name string `json:"name"`
	Link string `json:"link"`
}
type Project struct{
	Name string `json:"name"`
	Link string `json:"link"`
}

func Activities(c *gin.Context){
	data:=&Activitie{}
	data.Id="trend-1"
	data.Template="在 @{group} 新建项目 @{project}"
	data.UpdatedAt="2019-06-01T01:06:00.024Z"
	data.User.Name="丽丽"
	data.User.Avatar="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
	data.Group.Name="高逼格设计天团"
	data.Group.Link="http://github.com/"
	data.Project.Name="六月迭代"
	data.Project.Link="http://github.com/"
	c.JSON(http.StatusOK,data)
}
type Notice struct{
	Description string `json:"description"`
	Href string `json:"href"`
	Id string `json:"id"`
	Logo string `json:"logo"`
	Member string `json:"member"`
	MemberLink string `json:"memberLink"`
	Title string `json:"title"`
	UpdatedAt string `json:"updatedAt"`
}
func ProjectNotice(c *gin.Context){
	notice:=&Notice{
		Id:"xxx1",
		Href:"",
		Description:"那是一种内在的东西，他们到达不了，也无法触及的",
		Logo:"https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
		Member:"科学搬砖组",
		MemberLink:"",
		Title:"alipay",
		UpdatedAt:"2019-06-01T01:06:00.024Z",
	}
	c.JSON(http.StatusOK,notice)
}
type Tag struct{
	Name string `json:"name"`
	Type int `json:"type"`
	Value int `json:"value"`
}
type List struct{
	List []*Tag `json:"list"`
}
func Tags(c *gin.Context){
	data:=&List{}
	tag:=&Tag{
		Name:"衢州市",
		Type:1,
		Value:68,
	}
	data.List=append(data.List,tag)
	c.JSON(http.StatusOK,data)
}
type Rule struct{
	Key int `json:"key"`
	Href string `json:"href"`
	Owner string `json:"owner"`
	CallNo int	`json:"callNo"`
	Desc string `json:"desc"`
	Name string `json:"name"`
	Status	int `json:"status"`
	Progress int `json:"progress"`
	Title string	`json:"title"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updateAt"`
	Disabled bool `json:"disabled"`
}
type Pagination struct{
	Current int `json:"current"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
type Rules struct{
	List []*Rule `json:"list"`

	Pagination Pagination `json:"pagination"`
}
func GetRules(c *gin.Context){
	data:=&Rules{}
	rule:=&Rule{
		Key:1,
		Href:"www.baidu.com",
		Owner:"张三",
		CallNo:1001,
		Desc:"这是一段描述",
		Name:"TradeCode ",
		Status:0,
		Progress:11,
		Title:"一个任务名称",
		CreatedAt:time.Now().Format("2006-01-02 15:04:05"),
		UpdatedAt:time.Now().Format("2006-01-02 15:04:05"),
		Disabled:true,
	}
	data.Pagination.Current=1
	data.Pagination.PageSize=10
	data.Pagination.Total=20
	data.List=append(data.List,rule)
	c.JSON(http.StatusOK,data)
}
func CurrentUser(c *gin.Context){
	type City struct{
		Key string `json:"key"`
		Label string `json:"label"`
	}
	type Province struct{
		Key string `json:"key"`
		Label string	`json:"label"`
	}
	type Geographic struct{
		City City `json:"city"`
		Province Province `json:"province"`
	}
	type Tag struct{
		Key string `json:"key"`
		Label string `json:"label"`
	}

	type User struct{
		Address string	`json:"address"`
		Avatar string	`json:"avatar"`
		Country string	`json:"country"`
		Grounp string `json:"grounp"`
		Name string `json:"name"`
		Email string	`json:"email"`
		NotifyCount int	`json:"notifyCount"`
		Phone string	`json:"phone"`
		Signature string	`json:"signature"`
		Title string `json:"title"`
		UnreadCount int `json:"unreadCount"`
		Userid string `json:"userid"`
		Geographic Geographic	`json:"geographic"`
		Tags []*Tag	`json:"tags"`
		Notice []*Notice	`json:"notice"`
	}
	data:=&User{}
	notice:=&Notice{
		Id:"xxx1",
		Href:"",
		Description:"那是一种内在的东西，他们到达不了，也无法触及的",
		Logo:"https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
		Member:"科学搬砖组",
		MemberLink:"",
		Title:"alipay",
		UpdatedAt:"2019-06-01T01:06:00.024Z",
	}
	data.Notice=append(data.Notice,notice)
	tag:=&Tag{
		Key:"0",
		Label:"很有想法",
	}
	data.Tags=append(data.Tags,tag)
	data.Address="美的全球创新中心"
	data.Avatar="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
	data.Name="陈阳林"
	data.Email="chenyl6@annto.com.cn"
	data.NotifyCount=12
	data.Phone="12345678"
	data.Signature="一笑风云过"
	data.Title="程序员"
	data.UnreadCount=11
	data.Userid="00000001"
	data.Geographic.City=City{
		Key:"0000001",
		Label:"佛山市",
	}
	data.Geographic.Province=Province{
		Key:"0000001",
		Label:"广东省",
	}
	c.JSON(http.StatusOK,data)
}