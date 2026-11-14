<?php

require_once __DIR__ . '/engine-base.php';
require_once __DIR__ . '/engine-contracts.php';
require_once __DIR__ . '/engine-errors.php';
require_once __DIR__ . '/engine-issues.php';
require_once __DIR__ . '/engine-parse.php';
require_once __DIR__ . '/engine-review.php';
require_once __DIR__ . '/engine-sequence.php';
require_once __DIR__ . '/engine-shape.php';
require_once __DIR__ . '/engine-tidy.php';
require_once __DIR__ . '/engine-totals.php';
require_once __DIR__ . '/engine-vault.php';

final class MenuEngine
{
    public function __construct(private readonly MenuStore $store)
    {
    }

    public static function fromConfig(array $storage): self
    {
        return new self(new MenuFileStore(
            $storage['menu_file'],
            $storage['backup_dir'],
            $storage['backups_kept'],
        ));
    }

    public function read(): MenuSnapshot
    {
        $raw = $this->store->read();

        $document = json_decode($raw, true);
        if (!is_array($document)) {
            throw MenuEngineException::storage('the menu file is not a JSON object');
        }

        return new MenuSnapshot($raw, MenuEtag::of($raw), $document);
    }

    public function update(string $body, string $ifMatch): MenuUpdateResult
    {
        if ($ifMatch === '') {
            throw MenuEngineException::preconditionRequired();
        }

        $document = MenuDecoder::decode($body);

        $issues = new MenuIssues();
        MenuValidator::validate($document, $issues);
        if ($issues->hasErrors()) {
            throw MenuEngineException::invalidMenu($issues->errors());
        }

        $menu = MenuIdAllocator::assign($document);
        $menu = MenuComposer::compose($menu);
        $menu = MenuReferences::resolve($menu, $issues);
        $menu = MenuPricing::apply($menu);
        $menu['updatedAt'] = self::now();

        self::assertValid($menu);

        $wire = MenuComposer::toWire($menu);
        $json = json_encode($wire, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);

        $this->store->replace($ifMatch, $json);

        return new MenuUpdateResult(MenuEtag::of($json), $wire, $issues->warnings());
    }

    private static function assertValid(array $menu): void
    {
        $check = new MenuIssues();
        MenuValidator::validate($menu, $check);
        if ($check->hasErrors()) {
            throw MenuEngineException::engineBug($check->errors());
        }
    }

    private static function now(): string
    {
        return (new DateTimeImmutable('now', new DateTimeZone('Africa/Cairo')))->format(DATE_ATOM);
    }
}
