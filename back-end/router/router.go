package router
import (
	"github.com/gin-gonic/gin"
	"go-antd-admin/controllers/user"
	"go-antd-admin/controllers/menu"
	"go-antd-admin/controllers/demo"
	"go-antd-admin/middleware/jwt"
)
func InitRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/",user.Index)
	r.POST("/v1/register",user.Register)
	r.POST("/v1/login",user.Login)
	r.GET("/v1/createMenu",menu.CreateMenu)
	r.GET("/v1/editMenu",menu.EditMenu)
	r.GET("/v1/getMenu",menu.GetMenu)
	r.GET("/v1/deleteMenu",menu.DeleteMenu)
	r.GET("/v1/getMenus",menu.GetMenus)
	r.GET("/v1/getMenusManage",menu.GetMenusManage)
	r.GET("/v1/getAllMenus",menu.GetAllMenus)
	//r.GET("/api/currentUser",user.CurrentUser)
	taR := r.Group("/v1/auth")
    taR.Use(jwt.JWTAuth())

    {
		taR.GET("/hello", user.Index)
		taR.GET("/currentUser",user.CurrentUser)
	}
	tbR := r.Group("/v1/demo")
	{
		tbR.GET("/fake_chart_data",demo.Fake_chart_data)
		tbR.GET("/activities",demo.Activities)
		tbR.GET("/project/notice",demo.ProjectNotice)
		tbR.GET("/tags",demo.Tags)
		tbR.GET("/rule",demo.GetRules)
		tbR.GET("/currentUser",demo.CurrentUser)
	}
	return r
}