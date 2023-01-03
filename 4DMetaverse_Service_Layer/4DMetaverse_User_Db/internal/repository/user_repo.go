package repository

import (
	"4dmetaverse/user_db/internal/entity"

	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_user_repo.go -package=mocks . UserRepo
type UserRepo interface {
	Repository
	FindById(id string) (*entity.User, error)
	FindByEmail(email string) (*entity.User, error)
	Create(user *entity.User) error
	Update(id string, user *entity.User) error
}

type userRepo struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) UserRepo {
	db.AutoMigrate(&entity.User{})
	return &userRepo{
		db: db,
	}
}

func (ur *userRepo) FindByNativeSQL(sql string) any {
	result := []entity.User{}
	ur.db.Raw(sql).Scan(&result)
	return result
}

func (ur *userRepo) FindById(id string) (*entity.User, error) {
	user := entity.User{}
	if err := ur.db.
		Where("id = ?", id).
		Take(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (ur *userRepo) FindByEmail(email string) (*entity.User, error) {
	user := entity.User{}
	if err := ur.db.
		Where("email = ?", email).
		Take(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (ur *userRepo) Create(user *entity.User) error {
	err := ur.db.Create(user).Error
	return err
}

func (ur *userRepo) Update(id string, user *entity.User) error {
	err := ur.db.Model(&entity.User{Id: id}).Updates(user).Error
	return err
}
