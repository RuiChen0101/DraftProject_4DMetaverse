package service

import (
	"4dmetaverse/main_db/internal/entity"
	"4dmetaverse/main_db/internal/repository"

	"github.com/dranikpg/dto-mapper"
	"github.com/google/uuid"
)

type ShopGroupCreateDTO struct {
	Id            uuid.UUID `json:"id"`
	Title         string    `json:"title"`
	Tags          []string  `json:"tags"`
	CoverImageUrl string    `json:"coverImageUrl"`
	CreateBy      string    `json:"createBy"`
}

type ShopGroupUpdateDTO struct {
	Title         string   `json:"title"`
	Tags          []string `json:"tags"`
	CoverImageUrl string   `json:"coverImageUrl"`
	Status        int8     `json:"status"`
	UpdateBy      string   `json:"updateBy"`
}

//go:generate mockgen -destination=../../test/mocks/mock_shop_group_service.go -package=mocks . ShopGroupService
type ShopGroupService interface {
	Service
	CreateEntity(shopGroupDto ShopGroupCreateDTO) (*entity.ShopGroup, error)
	UpdateEntity(id uuid.UUID, shopGroupDto ShopGroupUpdateDTO) (*entity.ShopGroup, error)
	DeleteEntity(id uuid.UUID) error
}

type shopGroupService struct {
	shopGroupRepo repository.ShopGroupRepo
}

func NewShopGroupService(shopGroupRepo repository.ShopGroupRepo) ShopGroupService {
	return &shopGroupService{
		shopGroupRepo: shopGroupRepo,
	}
}

func (ss *shopGroupService) GetEntitiesBySQL(sql string) any {
	return ss.shopGroupRepo.FindByNativeSQL(sql)
}

func (ss *shopGroupService) CreateEntity(shopGroupDto ShopGroupCreateDTO) (*entity.ShopGroup, error) {
	shopGroup := entity.ShopGroup{}
	dto.Map(&shopGroup, shopGroupDto)
	if shopGroup.Tags == nil {
		shopGroup.Tags = []string{}
	}
	if err := ss.shopGroupRepo.Create(&shopGroup); err != nil {
		return nil, err
	}
	return &shopGroup, nil
}

func (ss *shopGroupService) UpdateEntity(id uuid.UUID, shopGroupDto ShopGroupUpdateDTO) (*entity.ShopGroup, error) {
	shopGroup := entity.ShopGroup{}
	dto.Map(&shopGroup, shopGroupDto)
	if err := ss.shopGroupRepo.Update(id, &shopGroup); err != nil {
		return nil, err
	}
	s, _ := ss.shopGroupRepo.FindById(id)
	return s, nil
}

func (ss *shopGroupService) DeleteEntity(id uuid.UUID) error {
	return ss.shopGroupRepo.Delete(id)
}
