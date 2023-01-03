package service

import (
	"4dmetaverse/main_db/internal/entity"
	"4dmetaverse/main_db/internal/repository"

	"github.com/dranikpg/dto-mapper"
	"github.com/google/uuid"
)

type UnlockedCollectionCreateDTO struct {
	CollectionId uuid.UUID `json:"collectionId"`
	UserId       string    `json:"userId"`
	CreateBy     string    `json:"createBy"`
}

//go:generate mockgen -destination=../../test/mocks/mock_unlocked_collection_service.go -package=mocks . UnlockedCollectionService
type UnlockedCollectionService interface {
	Service
	CreateEntity(unlockedDto UnlockedCollectionCreateDTO) (*entity.UnlockedCollection, error)
	DeleteEntity(id uint64) error
}

type unlockedCollectionService struct {
	unlockedCollectionRepo repository.UnlockedCollectionRepo
}

func NewUnlockedCollectionService(unlockedCollectionRepo repository.UnlockedCollectionRepo) UnlockedCollectionService {
	return &unlockedCollectionService{
		unlockedCollectionRepo: unlockedCollectionRepo,
	}
}

func (ucs *unlockedCollectionService) GetEntitiesBySQL(sql string) any {
	return ucs.unlockedCollectionRepo.FindByNativeSQL(sql)
}

func (ucs *unlockedCollectionService) CreateEntity(unlockedDto UnlockedCollectionCreateDTO) (*entity.UnlockedCollection, error) {
	unlocked := entity.UnlockedCollection{}
	dto.Map(&unlocked, unlockedDto)
	if err := ucs.unlockedCollectionRepo.Create(&unlocked); err != nil {
		return nil, err
	}
	return &unlocked, nil
}

func (ucs *unlockedCollectionService) DeleteEntity(id uint64) error {
	return ucs.unlockedCollectionRepo.Delete(id)
}
