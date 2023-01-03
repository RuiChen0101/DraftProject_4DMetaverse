package service

type Service interface {
	GetEntitiesBySQL(sql string) any
}
