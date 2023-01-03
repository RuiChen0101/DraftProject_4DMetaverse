package repository

type Repository interface {
	FindByNativeSQL(sql string) any
}
