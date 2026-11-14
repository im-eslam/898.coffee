<?php


final class MenuDecoder
{
    public static function decode(string $body): array
    {
        try {
            $document = json_decode($body, true, 32, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            throw MenuEngineException::invalidJson();
        }

        if (!is_array($document) || (array_is_list($document) && $document !== [])) {
            throw MenuEngineException::invalidJson();
        }

        unset($document['ok']);   
        return $document;
    }
}
