package service

import (
	"4dmetaverse/main_db/internal/entity"
	"4dmetaverse/main_db/internal/repository"

	"github.com/dranikpg/dto-mapper"
	"github.com/google/uuid"
)

type ShopCreateDTO struct {
	Id          uuid.UUID `json:"id"`
	GroupId     uuid.UUID `json:"groupId"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreateBy    string    `json:"createBy"`
}

type ShopUpdateDTO struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      int8   `json:"status"`
	UpdateBy    string `json:"updateBy"`
}

//go:generate mockgen -destination=../../test/mocks/mock_shop_service.go -package=mocks . ShopService
type ShopService interface {
	Service
	GetEntity(id uuid.UUID) (*entity.Shop, error)
	CreateEntity(shopDto ShopCreateDTO) (*entity.Shop, error)
	UpdateEntity(id uuid.UUID, shopDto ShopUpdateDTO) (*entity.Shop, error)
	DeleteEntity(id uuid.UUID) error
}

type shopService struct {
	shopRepo         repository.ShopRepo
	shopImageService ShopImageService
	salePlanService  SalePlanService
}

func NewShopService(shopRepo repository.ShopRepo, shopImageService ShopImageService, salePlanService SalePlanService) ShopService {
	return &shopService{
		shopRepo:         shopRepo,
		shopImageService: shopImageService,
		salePlanService:  salePlanService,
	}
}

func (ss *shopService) GetEntitiesBySQL(sql string) any {
	shops := ss.shopRepo.FindByNativeSQL(sql).([]entity.Shop)
	for i := range shops {
		ss.loadTransitColumn(&shops[i])
	}
	return shops
}

func (ss *shopService) GetEntity(id uuid.UUID) (*entity.Shop, error) {
	shop, err := ss.shopRepo.FindById(id)
	if err != nil {
		return nil, err
	}
	return ss.loadTransitColumn(shop), nil
}

func (ss *shopService) CreateEntity(shopDto ShopCreateDTO) (*entity.Shop, error) {
	shop := entity.Shop{}
	dto.Map(&shop, shopDto)
	if err := ss.shopRepo.Create(&shop); err != nil {
		return nil, err
	}
	return ss.loadTransitColumn(&shop), nil
}

func (ss *shopService) UpdateEntity(id uuid.UUID, shopDto ShopUpdateDTO) (*entity.Shop, error) {
	shop := entity.Shop{}
	dto.Map(&shop, shopDto)
	if err := ss.shopRepo.Update(id, &shop); err != nil {
		return nil, err
	}
	s, _ := ss.shopRepo.FindById(id)
	return ss.loadTransitColumn(s), nil
}

func (ss *shopService) DeleteEntity(id uuid.UUID) error {
	return ss.shopRepo.Delete(id)
}

func (ss *shopService) loadTransitColumn(shop *entity.Shop) *entity.Shop {
	coverImage, err := ss.shopImageService.GetCoverImage(shop.Id)
	if err == nil {
		shop.CoverImageUrl = coverImage.ImageUrl
	}
	salePlan, err := ss.salePlanService.GetDefaultSalePlan(shop.Id)
	if err == nil {
		shop.DefaultSalePlan = salePlan
	}
	return shop
}
