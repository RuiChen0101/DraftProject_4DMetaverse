package service

import (
	"4dmetaverse/main_db/internal/entity"
	"4dmetaverse/main_db/internal/repository"

	"github.com/dranikpg/dto-mapper"
	"github.com/google/uuid"
)

type SalePlanCreateDTO struct {
	Id        uuid.UUID `json:"id"`
	ShopId    uuid.UUID `json:"shopId"`
	Name      string    `json:"name"`
	Price     uint64    `json:"price"`
	IsDefault bool      `json:"isDefault"`
	CreateBy  string    `json:"createBy"`
}

type SalePlanUpdateDTO struct {
	Name     string `json:"name"`
	Price    uint64 `json:"price"`
	Status   int8   `json:"status"`
	UpdateBy string `json:"updateBy"`
}

type SalePlanSetCollectionsDTO struct {
	CollectionIds []uuid.UUID `json:"collectionIds"`
}

//go:generate mockgen -destination=../../test/mocks/mock_sale_plan_service.go -package=mocks . SalePlanService
type SalePlanService interface {
	Service
	GetEntity(id uuid.UUID) (*entity.SalePlan, error)
	GetDefaultSalePlan(shopId uuid.UUID) (*entity.SalePlan, error)
	CreateEntity(salePlanDto SalePlanCreateDTO) (*entity.SalePlan, error)
	UpdateEntity(id uuid.UUID, salePlanDto SalePlanUpdateDTO) (*entity.SalePlan, error)
	SetCollections(id uuid.UUID, appendDto SalePlanSetCollectionsDTO) error
	SwitchDefault(id uuid.UUID) error
	DeleteEntity(id uuid.UUID) error
}

type salePlanService struct {
	salePlanRepo      repository.SalePlanRepo
	collectionService CollectionService
}

func NewSalePlanService(salePlanRepo repository.SalePlanRepo, collectionService CollectionService) SalePlanService {
	return &salePlanService{
		salePlanRepo:      salePlanRepo,
		collectionService: collectionService,
	}
}

func (sps *salePlanService) GetEntitiesBySQL(sql string) any {
	salePlans := sps.salePlanRepo.FindByNativeSQL(sql).([]entity.SalePlan)
	for i := range salePlans {
		sps.loadTransitColumn(&salePlans[i])
	}
	return salePlans
}

func (sps *salePlanService) GetEntity(id uuid.UUID) (*entity.SalePlan, error) {
	salePlan, err := sps.salePlanRepo.FindById(id)
	if err != nil {
		return nil, err
	}
	return sps.loadTransitColumn(salePlan), nil
}

func (sps *salePlanService) GetDefaultSalePlan(shopId uuid.UUID) (*entity.SalePlan, error) {
	salePlan, err := sps.salePlanRepo.FindDefaultSalePlan(shopId)
	if err != nil {
		return nil, err
	}
	return sps.loadTransitColumn(salePlan), nil
}

func (sps *salePlanService) CreateEntity(salePlanDto SalePlanCreateDTO) (*entity.SalePlan, error) {
	salePlan := entity.SalePlan{}
	dto.Map(&salePlan, salePlanDto)
	if err := sps.salePlanRepo.Create(&salePlan); err != nil {
		return nil, err
	}
	return sps.loadTransitColumn(&salePlan), nil
}

func (sps *salePlanService) UpdateEntity(id uuid.UUID, salePlanDto SalePlanUpdateDTO) (*entity.SalePlan, error) {
	salePlan := entity.SalePlan{}
	dto.Map(&salePlan, salePlanDto)
	if err := sps.salePlanRepo.Update(id, &salePlan); err != nil {
		return nil, err
	}
	s, _ := sps.salePlanRepo.FindById(id)
	return sps.loadTransitColumn(s), nil
}

func (sps *salePlanService) SetCollections(id uuid.UUID, appendDto SalePlanSetCollectionsDTO) error {
	collections := []entity.Collection{}
	for _, id := range appendDto.CollectionIds {
		collections = append(collections, entity.Collection{Id: id, Data: map[string]interface{}{}})
	}
	return sps.salePlanRepo.SetCollections(id, collections)
}

func (sps *salePlanService) SwitchDefault(id uuid.UUID) error {
	salePlan, err := sps.salePlanRepo.FindById(id)
	if err != nil {
		return err
	}
	oldDefault, _ := sps.salePlanRepo.FindDefaultSalePlan(salePlan.ShopId)
	if oldDefault != nil {
		sps.salePlanRepo.Update(oldDefault.Id, &entity.SalePlan{IsDefault: false})
	}
	return sps.salePlanRepo.Update(id, &entity.SalePlan{IsDefault: true})
}

func (sps *salePlanService) DeleteEntity(id uuid.UUID) error {
	return sps.salePlanRepo.Delete(id)
}

func (sps *salePlanService) loadTransitColumn(salePlan *entity.SalePlan) *entity.SalePlan {
	preview, err := sps.collectionService.GetPreviewsBySalePlanId(salePlan.Id)
	if err == nil {
		salePlan.PreviewCollections = preview
	}
	return salePlan
}
