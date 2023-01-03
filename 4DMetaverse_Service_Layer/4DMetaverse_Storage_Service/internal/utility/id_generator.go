package utility

import gonanoid "github.com/matoous/go-nanoid/v2"

type IdGenerator interface {
	NanoId32() string
}

type DefaultIdGenerator struct{}

func (dig *DefaultIdGenerator) NanoId32() string {
	id, _ := gonanoid.Generate("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 32)
	return id
}
