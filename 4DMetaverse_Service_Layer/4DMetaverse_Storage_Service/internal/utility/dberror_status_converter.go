package utility

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

func ConvertDbErrorToStatus(err error) int {
	fmt.Println(err)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return http.StatusNotFound
	} else if sqlErr, ok := err.(*mysql.MySQLError); ok {
		if sqlErr.Number == 1062 {
			return http.StatusConflict
		}
		return http.StatusBadRequest
	}
	return http.StatusBadRequest
}
