package service

import (
	"4dmetaverse/main_db/internal/entity"
	"4dmetaverse/main_db/internal/repository"
	"errors"

	"github.com/dranikpg/dto-mapper"
	"github.com/google/uuid"
)

type CollectionCreateDTO struct {
	Id               uuid.UUID              `json:"id"`
	CollectionPoolId uint64                 `json:"collectionPoolId"`
	Title            string                 `json:"title"`
	Type             uint8                  `json:"type"`
	PreviewImageUrl  string                 `json:"previewImageUrl"`
	UnlockedImageUrl string                 `json:"unlockedImageUrl"`
	MediaUrl         string                 `json:"mediaUrl"`
	Data             map[string]interface{} `json:"data"`
	Available        int32                  `json:"available"`
	CreateBy         string                 `json:"createBy"`
}

type CollectionUpdateDTO struct {
	Title            string                 `json:"title"`
	Type             uint8                  `json:"type"`
	PreviewImageUrl  string                 `json:"previewImageUrl"`
	UnlockedImageUrl string                 `json:"unlockedImageUrl"`
	MediaUrl         string                 `json:"mediaUrl"`
	Data             map[string]interface{} `json:"data"`
	Status           int8                   `json:"status"`
	Available        int32                  `json:"available"`
	UpdateBy         string                 `json:"updateBy"`
}

//go:generate mockgen -destination=../../test/mocks/mock_collection_service.go -package=mocks . CollectionService
type CollectionService interface {
	Service
	GetEntity(id uuid.UUID) (*entity.Collection, error)
	GetPreviewsBySalePlanId(salePlanId uuid.UUID) ([]entity.PreviewCollection, error)
	CreateEntity(collectionDto CollectionCreateDTO) (*entity.Collection, error)
	UpdateEntity(id uuid.UUID, collectionDto CollectionUpdateDTO) (*entity.Collection, error)
	DeleteEntity(id uuid.UUID) error
}

type collectionService struct {
	collectionRepo repository.CollectionRepo
}

func NewCollectionService(collectionRepo repository.CollectionRepo) CollectionService {
	return &collectionService{
		collectionRepo: collectionRepo,
	}
}

func (cs *collectionService) GetEntitiesBySQL(sql string) any {
	collections := cs.collectionRepo.FindByNativeSQL(sql).([]entity.Collection)
	for i := range collections {
		cs.loadTransitColumn(&collections[i])
	}
	return collections
}

func (cs *collectionService) GetEntity(id uuid.UUID) (*entity.Collection, error) {
	collection, err := cs.collectionRepo.FindById(id)
	if err != nil {
		return nil, err
	}
	return cs.loadTransitColumn(collection), nil
}

func (cs *collectionService) GetPreviewsBySalePlanId(salePlanId uuid.UUID) ([]entity.PreviewCollection, error) {
	collections, err := cs.collectionRepo.ListBySalePlanId(salePlanId)
	if err != nil {
		return nil, err
	}
	result := []entity.PreviewCollection{}
	for _, c := range collections {
		cs.loadTransitColumn(&c)
		result = append(result, c.ToPreview())
	}
	return result, nil
}

func (cs *collectionService) CreateEntity(collectionDto CollectionCreateDTO) (*entity.Collection, error) {
	collection := entity.Collection{}
	dto.Map(&collection, collectionDto)
	if collection.Data == nil {
		collection.Data = make(map[string]interface{})
	}
	if err := cs.collectionRepo.Create(&collection); err != nil {
		return nil, err
	}
	return cs.loadTransitColumn(&collection), nil
}

func (cs *collectionService) UpdateEntity(id uuid.UUID, collectionDto CollectionUpdateDTO) (*entity.Collection, error) {
	collection := entity.Collection{}
	dto.Map(&collection, collectionDto)
	if err := cs.collectionRepo.Update(id, &collection); err != nil {
		return nil, err
	}
	c, _ := cs.collectionRepo.FindById(id)
	return cs.loadTransitColumn(c), nil
}

func (cs *collectionService) DeleteEntity(id uuid.UUID) error {
	count := cs.collectionRepo.CountUnlocked(id)
	if count != 0 {
		return errors.New("CollectionService: cannot delete unlocked collection")
	}
	return cs.collectionRepo.Delete(id)
}

func (cs *collectionService) loadTransitColumn(collection *entity.Collection) *entity.Collection {
	count := cs.collectionRepo.CountUnlocked(collection.Id)
	collection.TotalUnlocked = count
	return collection
}
