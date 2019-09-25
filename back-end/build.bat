SET CGO_ENABLED=0
SET GOOS=linux
SET GOARCH=amd64
SET GIN_MODE=release
go build -o go_antd_admin main.go  