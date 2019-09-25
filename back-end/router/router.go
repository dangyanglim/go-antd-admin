package router
import (
	"github.com/gin-gonic/gin"
	"go-antd-admin/controllers/user"
	"go-antd-admin/middleware/jwt"
)
func InitRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/",user.Index)
	r.POST("/v1/register",user.Register)
	r.POST("/v1/login",user.Login)
	r.GET("/api/currentUser",user.CurrentUser)
	taR := r.Group("/v1/auth")
    taR.Use(jwt.JWTAuth())

    {
		taR.GET("/hello", user.Index)
		taR.GET("/currentUser",user.CurrentUser)
    }
	return r
}