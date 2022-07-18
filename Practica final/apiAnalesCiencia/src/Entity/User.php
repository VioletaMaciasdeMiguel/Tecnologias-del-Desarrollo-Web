<?php

/**
 * src/Entity/User.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    http://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Entity;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;
use UnexpectedValueException;

/**
 * @ORM\Entity()
 * @ORM\Table(
 *     name                 = "user",
 *     uniqueConstraints    = {
 *          @ORM\UniqueConstraint(
 *              name="IDX_UNIQ_USERNAME", columns={ "username" }
 *          ),
 *          @ORM\UniqueConstraint(
 *              name="IDX_UNIQ_EMAIL", columns={ "email" }
 *          )
 *      }
 *     )
 */
class User implements JsonSerializable
{
    /**
     * @ORM\Column(
     *     name     = "id",
     *     type     = "integer",
     *     nullable = false
     *     )
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected int $id;

    /**
     * @ORM\Column(
     *     name     = "username",
     *     type     = "string",
     *     length   = 32,
     *     unique   = true,
     *     nullable = false
     *     )
     */
    protected string $username;

    /**
     * @ORM\Column(
     *     name     = "email",
     *     type     = "string",
     *     length   = 60,
     *     unique   = true,
     *     nullable = false
     *     )
     */
    protected string $email;

	/**
     * @ORM\Column(
     *     name="name",
     *     type="string",
     *     length   = 60,
     *     nullable=true
     *     )
     */
	protected string | null  $name = null;
	
	/**
     * @ORM\Column(
     *     name="birthDate",
     *     type="string",
     *     length   = 60,
     *     nullable=true
     *     )
     */
	protected string | null  $birthDate = null;
	
	/**
     * @ORM\Column(
     *     name     = "Url",
     *     type     = "string",
     *     length   = 60,
     *     nullable = true
     *     )
     */
	protected string | null  $Url = null;
	
	/**
     * @ORM\Column(
     *     name     = "Activo",
     *     type     = "integer",
     *     length   = 60,
     *     nullable = true
     *     )
     */
	protected int | null  $Activo = null;
	
    /**
     * @ORM\Column(
     *     name     = "password",
     *     type     = "string",
     *     length   = 60,
     *     nullable = false
     *     )
     */
    protected string $password_hash;

    /**
     * @ORM\Embedded(
     *     class="TDW\ACiencia\Entity\Role"
     * )
     */
    protected Role $role;

    /**
     * User constructor.
     *
     * @param string $username username
     * @param string $email email
     * @param string $password password
     * @param string $role Role::ROLE_READER | Role::ROLE_WRITER
	 * @param string|null $name name
     * @param string|null $birthDate birthDate
     * @param string|null $Url Url
     * @param int|null $Activo Activo
     *
     * @throws UnexpectedValueException
     */
    public function __construct(
        string $username = '',
        string $email = '',
        string $password = '',
        string $role = Role::ROLE_READER,
		?string $name = null,
	    ?string $birthDate = null,
		?string $Url = null,
		?int $Activo = 0
    ) {
        $this->id       = 0;
        $this->username = $username;
        $this->email    = $email;
        $this->setPassword($password);
        $this->name     = $name;
        $this->birthDate= $birthDate;
        $this->Url      = $Url;
        $this->Activo   = $Activo;
        try {
            $this->setRole($role);
        } catch (UnexpectedValueException) {
            throw new UnexpectedValueException('Unexpected Role');
        }
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * Set username
     *
     * @param string $username username
     * @return void
     */
    public function setUsername(string $username): void
    {
        $this->username = $username;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $email email
     * @return void
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }
	
	/**
     * @return string|null
     */
	public function getname(): ?string
    {
        return $this->name;
    }
	
	/**
     * @param string|null $name name
     * @return void
     */
    public function setname(?string $name): void
    {
        $this->name = $name;
    }
	
	/**
     * @return string|null
     */
	public function getbirthDate(): ?string
    {
        return $this->birthDate;
    }
	
	/**
     * @param string|null $birthDate birthDate
     * @return void
     */
    public function setbirthDate(?string $birthDate): void
    {
        $this->birthDate = $birthDate;
    }
	
	/**
     * @return string|null
     */
	public function getUrl(): ?string
    {
        return $this->Url;
    }
	
	/**
     * @param string|null $Url Url
     * @return void
     */
    public function setUrl(?string $Url): void
    {
        $this->Url = $Url;
    }
	
	/**
     * @return int|null
     */
	public function getActivo(): ?int
    {
        return $this->Activo;
    }

	/**
     * @param int|null $Activo Activo
     * @return void
     */
    public function setActivo(?int $Activo): void
    {
        $this->Activo = $Activo;
    }

    /**
     * @param string $role
     * @return boolean
     */
    public function hasRole(string $role): bool
    {
        return $this->role->hasRole($role);
    }

    /**
     * @param string $role [ Role::ROLE_READER | Role::ROLE_WRITER ]
     * @throws UnexpectedValueException
     * @return void
     */
    public function setRole(string $role): void
    {
        // Object types are compared by reference, not by value.
        // Doctrine updates this values if the reference changes and therefore
        // behaves as if these objects are immutable value objects.
        $this->role = new Role($role);
    }

    /**
     * @return array ['reader'] | ['reader', 'writer']
     */
    public function getRoles(): array
    {
        $roles = array_filter(
            Role::ROLES,
            fn($myRole) => $this->hasRole($myRole)
        );

        return $roles;
    }

    /**
     * Get the hashed password
     *
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password_hash;
    }

    /**
     * @param string $password password
     * @return void
     */
    public function setPassword(string $password): void
    {
        $this->password_hash = strval(password_hash($password, PASSWORD_DEFAULT));
    }

    /**
     * Verifies that the given hash matches the user password.
     *
     * @param string $password password
     * @return boolean
     */
    public function validatePassword(string $password): bool
    {
        return password_verify($password, $this->password_hash);
    }

    /**
     * The __toString method allows a class to decide how it will react when it is converted to a string.
     *
     * @return string
     * @link http://php.net/manual/en/language.oop5.magic.php#language.oop5.magic.tostring
     */
    public function __toString(): string
    {
        return
            sprintf(
                '[%s: (id=%04d, username="%s", email="%s", role="%s", name="%s", birthDate="%s", Url="%s", Activo="%d")]',
                basename(self::class),
                $this->getId(),
                $this->getUsername(),
                $this->getEmail(),
                $this->role,
                $this->getname(),
                $this->getbirthDate(),
                $this->getUrl(),
                $this->getActivo()
            );
    }

    /**
     * Specify data which should be serialized to JSON
     * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return array data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    public function jsonSerialize(): array
    {
        return [
            'user' => [
                'id' => $this->getId(),
                'username' => $this->getUsername(),
                'email' => $this->getEmail(),
                'role' => $this->role->__toString(),
                'name' => $this->getname() ?? null,
                'birthDate' => $this->getbirthDate() ?? null,
                'Url' => $this->getUrl() ?? null,
                'Activo' => $this->getActivo() ?? null,
            ]
        ];
    }
}
