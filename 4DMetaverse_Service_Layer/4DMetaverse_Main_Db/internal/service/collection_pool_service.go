package service

import (
	"4dmetaverse/main_db/internal/entity"
	"4dmetaverse/main_db/internal/repository"
	"errors"

	"github.com/dranikpg/dto-mapper"
)

type CollectionPoolCreateDTO struct {
	Name          string `json:"name"`
	CoverImageUrl string `json:"coverImageUrl"`
	CreateBy      string `json:"createBy"`
}

type CollectionPoolUpdateDTO struct {
	Name          string `json:"name"`
	CoverImageUrl string `json:"coverImageUrl"`
	UpdateBy      string `json:"updateBy"`
}

//go:generate mockgen -destination=../../test/mocks/mock_collection_pool_service.go -package=mocks . CollectionPoolService
type CollectionPoolService interface {
	Service
	CreateEntity(poolDto CollectionPoolCreateDTO) (*entity.CollectionPool, error)
	UpdateEntity(id uint64, poolDto CollectionPoolUpdateDTO) (*entity.CollectionPool, error)
	DeleteEntity(id uint64) error
}

type collectionPoolService struct {
	collectionPoolRepo repository.CollectionPoolRepo
}

func NewCollectionPoolService(collectionPoolRepo repository.CollectionPoolRepo) CollectionPoolService {
	return &collectionPoolService{
		collectionPoolRepo: collectionPoolRepo,
	}
}

func (cps *collectionPoolService) GetEntitiesBySQL(sql string) any {
	return cps.collectionPoolRepo.FindByNativeSQL(sql)
}

func (cps *collectionPoolService) CreateEntity(poolDto CollectionPoolCreateDTO) (*entity.CollectionPool, error) {
	pool := entity.CollectionPool{}
	dto.Map(&pool, poolDto)
	if err := cps.collectionPoolRepo.Create(&pool); err != nil {
		return nil, err
	}
	return &pool, nil
}

func (cps *collectionPoolService) UpdateEntity(id uint64, poolDto CollectionPoolUpdateDTO) (*entity.CollectionPool, error) {
	pool := entity.CollectionPool{}
	dto.Map(&pool, poolDto)
	if err := cps.collectionPoolRepo.Update(id, &pool); err != nil {
		return nil, err
	}
	p, _ := cps.collectionPoolRepo.FindById(id)
	return p, nil
}

func (cps *collectionPoolService) DeleteEntity(id uint64) error {
	count := cps.collectionPoolRepo.CountCollection(id)
	if count != 0 {
		return errors.New("CollectionPoolService: cannot delete non-empty pool")
	}
	return cps.collectionPoolRepo.Delete(id)
}
