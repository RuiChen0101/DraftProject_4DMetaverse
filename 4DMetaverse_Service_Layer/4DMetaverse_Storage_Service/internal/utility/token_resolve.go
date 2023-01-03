package utility

type Auth struct {
	Id     string
	Name   string
	Type   uint8
	Allow  []string
	Role   uint8
	Flag   uint16
	Status int8
	Nonce  string
	Exp    int
}

type TokenResolve struct {
	timer Timer
}

func NewTokenResolve(
	timer Timer,
) TokenResolve {
	return TokenResolve{
		timer: timer,
	}
}

func (tr *TokenResolve) Resolve(jwt string) (*Auth, error) {

	return nil, nil
}
