package utility

import (
	"4dmetaverse/main_db/internal/utility"
	"errors"
	"net/http"
	"testing"

	"github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestNotFoundTo404(t *testing.T) {
	code := utility.ConvertDbErrorToStatus(gorm.ErrRecordNotFound)
	assert.Equal(t, http.StatusNotFound, code)
}

func TestConflictTo409(t *testing.T) {
	code := utility.ConvertDbErrorToStatus(&mysql.MySQLError{Number: 1062})
	assert.Equal(t, http.StatusConflict, code)
}

func TestOtherTo400(t *testing.T) {
	code := utility.ConvertDbErrorToStatus(errors.New(""))
	assert.Equal(t, http.StatusBadRequest, code)
}
