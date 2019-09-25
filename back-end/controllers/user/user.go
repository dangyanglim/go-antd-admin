package user
import (
	"github.com/gin-gonic/gin"
	//"net/http"
	"fmt"
	"go-antd-admin/utils/result"
	"go-antd-admin/utils/e"
	"go-antd-admin/models"
	"go-antd-admin/middleware/jwt"
)
func Index(c *gin.Context) {
	c.String(200, "Hello World2")
}
// 注册信息
type RegistInfo struct {
	Name string `form:"name" binding:"required"`
	Pwd string `form:"pwd" binding:"required"`
}
var userModel = new(models.User)
// @Summary 注册用户
// @Produce  json
// @Param name query string true "name"
// @Param pwd query string true "password"
// @Success 200 {object} result.Response
// @Failure 500 {object} result.Response
// @Router /register [get]
type UserRes struct{
	models.User
	Token string `json:"token"`
}
func Register(c *gin.Context){
	var registerInfo RegistInfo
	if c.ShouldBind(&registerInfo) == nil {
		if _,err:=userModel.GetUserByName(registerInfo.Name);err!=nil{
			
			user:=models.User{Name:registerInfo.Name,Pwd:registerInfo.Pwd}
			if user,err=userModel.AddUser(user);err==nil{
				user.Pwd=""
				jwtTemp:=jwt.NewJWT()
				token,_:=jwtTemp.CreateToken(user.Name,int(user.ID))
				var userRes UserRes
				userRes.User=user
				userRes.Token=token
				result.SuccessWithData(c,e.REGISTER_SUCCESS,userRes)
			}else{
				result.Error(c,e.ERROR_CREATE_USER)
			}
			
		}else{
			result.Error(c,e.ERROR_EXIST_USER )
		}
		
	}else{
		fmt.Println(registerInfo)
		result.Error(c,e.INVALID_PARAMS)
	}
}
func Login(c *gin.Context){
	var registerInfo RegistInfo
	if c.ShouldBind(&registerInfo) == nil {
		if user,err:=userModel.GetUserByName(registerInfo.Name);err==nil{
				user.Pwd=""
				jwtTemp:=jwt.NewJWT()
				token,_:=jwtTemp.CreateToken(user.Name,int(user.ID))
				var userRes UserRes
				userRes.User=user
				userRes.Token=token
				result.SuccessWithData(c,e.LOGIN_SUCCESS,userRes)
			
		}else{
			result.Error(c,e.ERROR_NOT_EXIST_USER)
		}
		
	}else{
		fmt.Println(registerInfo)
		result.Error(c,e.INVALID_PARAMS)
	}
}
func CurrentUser(c *gin.Context) {
	fmt.Println(c.Get("claims"))
	claims,_:=c.MustGet("claims").(*jwt.CustomClaims)
	fmt.Println(claims.Name)
	if user,err:=userModel.GetUserByName(claims.Name);err==nil{
		user.Pwd=""
		jwtTemp:=jwt.NewJWT()
		token,_:=jwtTemp.CreateToken(user.Name,int(user.ID))
		var userRes UserRes
		userRes.User=user
		userRes.Token=token
		result.SuccessWithData(c,e.LOGIN_SUCCESS,userRes)		
	}else{
		result.Error(c,e.ERROR_NOT_EXIST_USER)
	}
	// currentUser:=map[string]interface{}{
	// 	"address":"美的全球创新中心",
	// 	"avatar":"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
	// 	"country":"China",
	// }
	// result.SuccessWithData(c,e.LOGIN_SUCCESS,currentUser)
}