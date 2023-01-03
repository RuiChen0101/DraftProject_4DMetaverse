package utility

import (
	"context"
	"os"
	"time"

	"github.com/go-redis/redis/v9"
)

//go:generate mockgen -destination=../../test/mocks/mock_redis_client.go -package=mocks . RedisClient
type RedisClient interface {
	Get(key string) (string, error)
	Set(key string, value string) error
	Expire(key string, expiration time.Duration) error
	TTL(key string) (time.Duration, error)
}

type DefaultRedisClient struct {
	rdb *redis.Client
	ctx context.Context
}

func NewDefaultRedisClient(ctx context.Context, db int) *DefaultRedisClient {
	redis_addr := os.Getenv("REDIS_ADDR")
	return &DefaultRedisClient{
		rdb: redis.NewClient(&redis.Options{
			Addr:     redis_addr,
			Password: "",
			DB:       db,
		}),
		ctx: ctx,
	}
}

func (rc *DefaultRedisClient) Get(key string) (string, error) {
	return rc.rdb.Get(rc.ctx, key).Result()
}

func (rc *DefaultRedisClient) Set(key string, value string) error {
	return rc.rdb.Set(rc.ctx, key, value, 0).Err()
}

func (rc *DefaultRedisClient) Expire(key string, expiration time.Duration) error {
	return rc.rdb.Expire(rc.ctx, key, expiration).Err()
}

func (rc *DefaultRedisClient) TTL(key string) (time.Duration, error) {
	return rc.rdb.TTL(rc.ctx, key).Result()
}
