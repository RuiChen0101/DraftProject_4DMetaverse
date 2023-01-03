package service

import (
	"4dmetaverse/main_db/internal/entity"
	"4dmetaverse/main_db/internal/repository"

	"github.com/dranikpg/dto-mapper"
	"github.com/google/uuid"
)

type ShopImageCreateDTO struct {
	ShopId   uuid.UUID `json:"shopId"`
	ImageUrl string    `json:"imageUrl"`
	IsCover  bool      `json:"isCover"`
	CreateBy string    `json:"createBy"`
}

//go:generate mockgen -destination=../../test/mocks/mock_shop_image_service.go -package=mocks . ShopImageService
type ShopImageService interface {
	Service
	GetCoverImage(shopId uuid.UUID) (*entity.ShopImage, error)
	CreateEntity(shopImageDto ShopImageCreateDTO) (*entity.ShopImage, error)
	SwitchCover(id uint64) error
	DeleteEntity(id uint64) error
}

type shopImageService struct {
	shopImageRepo repository.ShopImageRepo
}

func NewShopImageService(shopImageRepo repository.ShopImageRepo) ShopImageService {
	return &shopImageService{
		shopImageRepo: shopImageRepo,
	}
}

func (sis *shopImageService) GetEntitiesBySQL(sql string) any {
	return sis.shopImageRepo.FindByNativeSQL(sql)
}

func (sis *shopImageService) GetCoverImage(shopId uuid.UUID) (*entity.ShopImage, error) {
	return sis.shopImageRepo.FindCoverImage(shopId)
}

func (sis *shopImageService) CreateEntity(shopImageDto ShopImageCreateDTO) (*entity.ShopImage, error) {
	shopImage := entity.ShopImage{}
	dto.Map(&shopImage, shopImageDto)
	if err := sis.shopImageRepo.Create(&shopImage); err != nil {
		return nil, err
	}
	return &shopImage, nil
}

func (sis *shopImageService) SwitchCover(id uint64) error {
	image, err := sis.shopImageRepo.FindById(id)
	if err != nil {
		return err
	}
	oldCover, _ := sis.shopImageRepo.FindCoverImage(image.ShopId)
	if oldCover != nil {
		sis.shopImageRepo.Update(oldCover.Id, &entity.ShopImage{IsCover: false})
	}
	return sis.shopImageRepo.Update(id, &entity.ShopImage{IsCover: true})
}

func (sis *shopImageService) DeleteEntity(id uint64) error {
	return sis.shopImageRepo.Delete(id)
}
