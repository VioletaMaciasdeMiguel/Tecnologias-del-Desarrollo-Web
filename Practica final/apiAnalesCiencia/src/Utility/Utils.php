<?php

/**
 * src/Utility/Utils.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    http://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Utility;

use Doctrine\ORM\Tools\SchemaTool;
use Dotenv\Dotenv;
use TDW\ACiencia\Entity\Role;
use TDW\ACiencia\Entity\User;
use Throwable;

/**
 * Class Utils
 */
class Utils
{
    /**
     * Load the environment/configuration variables
     * defined in .env file + (.env.docker || .env.local)
     *
     * @param string $dir   project root directory
     */
    public static function loadEnv(string $dir): void
    {
        /** @noinspection PhpIncludeInspection */
        require_once $dir . '/vendor/autoload.php';

        if (!class_exists(Dotenv::class)) {
            fwrite(STDERR, 'ERROR: No se ha cargado la clase Dotenv' . PHP_EOL);
            exit(1);
        }

        try {
            // Load environment variables from .env file
            if (file_exists($dir . '/.env')) {
                $dotenv = Dotenv::createMutable($dir, '.env');
                $dotenv->load();
            } else {
                fwrite(STDERR, 'ERROR: no existe el fichero .env' . PHP_EOL);
                exit(1);
            }

            // Overload (if they exist) with .env.docker or .env.local
            if (isset($_SERVER['DOCKER']) && file_exists($dir . '/.env.docker')) {
                $dotenv = Dotenv::createMutable($dir, '.env.docker');
                $dotenv->load();
            } elseif (file_exists($dir . '/.env.local')) {
                $dotenv = Dotenv::createMutable($dir, '.env.local');
                $dotenv->load();
            }
        } catch (Throwable $e) {
            fwrite(STDERR, 'EXCEPCIÓN: ' . $e->getCode() . ' - ' . $e->getMessage());
            exit(1);
        }
    }

    /**
     * Drop & Update database schema
     *
     * @return void
     */
    public static function updateSchema(): void
    {
        try {
            $e_manager = DoctrineConnector::getEntityManager();
            $metadata = $e_manager->getMetadataFactory()->getAllMetadata();
            $sch_tool = new SchemaTool($e_manager);
            $sch_tool->dropDatabase();
            $sch_tool->updateSchema($metadata, false);
        } catch (Throwable $e) {
            fwrite(
                STDERR,
                'EXCEPCIÓN: ' . $e->getCode() . ' - ' . $e->getMessage()
            );
            exit(1);
        }
    }

    /**
     * Load user data fixtures
     *
     * @param string $username user name
     * @param string $email user email
     * @param string $password user password
     * @param bool $isWriter isAdmin
     * @param string $name user name
     * @param string $birthDate user birthDate
     * @param string $Url user Url
     * @param int $Activo user Activo
     *
     * @return int user_id
     */
    public static function loadUserData(
        string $username,
        string $email,
        string $password,
        bool $isWriter = false,
		?string $name='',
        ?string $birthDate='',
        ?string $Url='',
        ?int $Activo = 1
    ): int {
        $user = new User(
            $username,
            $email,
            $password,
            ($isWriter) ? Role::ROLE_WRITER : Role::ROLE_READER,
			$name,
            $birthDate,
            $Url,
            $Activo
        );
        try {
            $e_manager = DoctrineConnector::getEntityManager();
            $e_manager->persist($user);
            $e_manager->flush();
        } catch (Throwable $e) {
            fwrite(STDERR, 'EXCEPCIÓN: ' . $e->getCode() . ' - ' . $e->getMessage());
            exit(1);
        }

        return $user->getId();
    }
}
