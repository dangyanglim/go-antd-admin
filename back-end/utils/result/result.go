package result
import (
	"github.com/gin-gonic/gin"
	"net/http"
	"go-antd-admin/utils/e"
)
type Response struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}
func Error(c *gin.Context,code int){
	c.JSON(http.StatusOK, Response{
		Code: code,
		Msg:  e.GetMsg(code),
	})
}
func Success(c *gin.Context,msg string){
	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  msg,
	})
}
func SuccessWithData(c *gin.Context,msg string,data interface{}){
	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  msg,
		"data": data,
	})
}