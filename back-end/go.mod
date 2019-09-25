module go-antd-admin

go 1.12

replace golang.org/x/net => github.com/golang/net v0.0.0-20190424024845-afe8014c977f

replace golang.org/x/sync => github.com/golang/sync v0.0.0-20190423024810-112230192c58

replace golang.org/x/sys => github.com/golang/sys v0.0.0-20190422165155-953cdadca894

replace golang.org/x/crypto => github.com/golang/crypto v0.0.0-20190422183909-d864b10871cd

replace golang.org/x/text => github.com/golang/text v0.3.0

replace cloud.google.com/go => github.com/googleapis/google-cloud-go v0.34.0

replace golang.org/x/oauth2 => github.com/golang/oauth2 v0.0.0-20190604053449-0f29369cfe45

replace google.golang.org/grpc => github.com/grpc/grpc-go v1.23.1

replace golang.org/x/tools => github.com/golang/tools v0.0.0-20190917032747-2dc213d980bc

replace golang.org/x/exp => github.com/golang/exp v0.0.0-20190912063710-ac5d2bfcbfe0

replace golang.org/x/lint => github.com/golang/lint v0.0.0-20190909230951-414d861bb4ac

replace golang.org/x/xerrors => github.com/golang/xerrors v0.0.0-20190717185122-a985d3407aa7

replace google.golang.org/api => github.com/googleapis/google-api-go-client v0.10.0

require (
	github.com/alecthomas/template v0.0.0-20190718012654-fb15b899a751
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/garyburd/redigo v1.6.0
	github.com/gin-gonic/gin v1.4.0
	github.com/go-sql-driver/mysql v1.4.1
	github.com/jinzhu/gorm v1.9.10
	github.com/swaggo/files v0.0.0-20190704085106-630677cd5c14
	github.com/swaggo/gin-swagger v1.2.0
	github.com/swaggo/swag v1.5.1
)
