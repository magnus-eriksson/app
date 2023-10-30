<?php

use DateTime;
use DateTimeZone;
use JsonSerializable;
use ReflectionClass;
use ReflectionProperty;

abstract class Entity implements JsonSerializable
{
    /**
     * @var int|null
     */
    public readonly ?int $id;

    /**
     * @var DateTime
     */
    public readonly DateTime $createdDate;

    /**
     * @var DateTime
     */
    public readonly DateTime $modifiedDate;

    /**
     * @var array
     */
    private static $props = [];

    /**
     * @param array $data
     */
    public function __construct(array $data = [])
    {
        $data = $this->preProcess($data);
        $tz = new DateTimeZone('UTC');

        foreach ($data as $key => $value) {
            if (static::hasProperty($key)) {
                if (str_ends_with($key, 'Date')) {
                    $value = DateTime::createFromFormat('Y-m-d H:i:s', $value, $tz);
                }

                $this->{$key} = $value;
            }
        }

        if (!key_exists('id', $data)) {
            $this->id = null;
        }

        if (!key_exists('createdDate', $data)) {
            $this->createdDate = new DateTime();
        }

        if (!key_exists('modifiedDate', $data)) {
            $this->modifiedDate = new DateTime();
        }
    }


    /**
     * @param array $data
     *
     * @return array
     */
    protected function preProcess(array $data): array
    {
        return $data;
    }


    /**
     * @param array $data
     *
     * @return self
     */
    public function set(array $data): self
    {
        $data = $this->preProcess($data);

        $immutable = ['id', 'createdDate', 'modifiedDate'];
        $tz = new DateTimeZone('UTC');

        foreach ($data as $key => $value) {
            if (!in_array($key, $immutable) && $this->hasProperty($key)) {
                if (str_ends_with($key, 'Date') && is_string($value)) {
                    $value = DateTime::createFromFormat('Y-m-d H:i:s', $value, $tz);
                }

                $this->{$key} = $value;
            }
        }

        return $this;
    }


    /**
     * @return array
     */
    public function toArray(): array
    {
        return array_map(fn ($key) => $this->{$key}, static::getProperties());
    }


    /**
     * @inheritDoc
     */
    public function jsonSerialize(): mixed
    {
        return array_map(function ($value) {
            return $value instanceof DateTime ? $value->format('Y-m-d H:i:s') : $value;
        }, $this->toArray());
    }


    /**
     * @return array
     */
    public function dbData(): array
    {
        $data = $this->toArray();
        unset($data['id']);

        if (isset($data['modifiedDate'])) {
            $data['modifiedDate'] = new DateTime('now', new DateTimeZone('UTC'));
        }

        return array_map(function ($value) {
            if ($value instanceof DateTime) {
                $value = $value->format('Y-m-d H:i:s');
            }

            return $value;
        }, $data);
    }



    /**
     * @param string $name
     *
     * @return bool
     */
    protected static function hasProperty(string $name): bool
    {
        $props = static::getProperties();
        return isset($props[$name]);
    }


    /**
     * Get all public properties
     *
     * @return array
     */
    protected static function getProperties(): array
    {
        $class = static::class;
        if (key_exists($class, static::$props)) {
            return static::$props[$class]['props'];
        }

        $props = array_filter(
            (new ReflectionClass(static::class))->getProperties(ReflectionProperty::IS_PUBLIC),
            fn ($prop) => !$prop->isStatic()
        );

        foreach ($props as $prop) {
            static::$props[$class]['props'][$prop->getName()] = $prop->getName();
        }

        return static::$props[$class]['props'];
    }
}
