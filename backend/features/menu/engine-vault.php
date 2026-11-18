<?php

interface MenuStore
{
    public function read(): string;
    public function replace(string $ifMatch, string $json): void;
}

final class MenuFileStore implements MenuStore
{
    public function __construct(
        private readonly string $file,
        private readonly string $backupDir,
        private readonly int $backupsKept,
    ) {}

    public function read(): string
    {
        $raw = @file_get_contents($this->file);
        if ($raw === false) {
            throw MenuEngineException::storage("cannot read {$this->file}");
        }
        return $raw;
    }

    public function replace(string $ifMatch, string $json): void
    {
        $lock = @fopen($this->file . '.lock', 'c');
        if ($lock === false) {
            throw MenuEngineException::storage('cannot open the menu lock');
        }

        flock($lock, LOCK_EX);
        try {
            $current = $this->read();
            if ($ifMatch !== MenuEtag::of($current)) {
                throw MenuEngineException::preconditionFailed();
            }
            $this->backup($current);
            $this->writeAtomic($json);
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    private function backup(string $current): void
    {
        if (!is_dir($this->backupDir) && !@mkdir($this->backupDir, 0700, true) && !is_dir($this->backupDir)) {
            throw MenuEngineException::storage('cannot create the backup folder');
        }

        $stamp = (new DateTimeImmutable('now', new DateTimeZone('Africa/Cairo')))->format('Ymd-His');
        $name  = $this->backupDir . '/menu-' . $stamp . '-' . bin2hex(random_bytes(3)) . '.json';
        if (file_put_contents($name, $current, LOCK_EX) === false) {
            throw MenuEngineException::storage('cannot write the menu backup');
        }

        $backups = glob($this->backupDir . '/menu-*.json') ?: [];
        sort($backups);
        foreach (array_slice($backups, 0, -$this->backupsKept) as $old) {
            @unlink($old);
        }
    }

    private function writeAtomic(string $json): void
    {
        $tmp = dirname($this->file) . '/.menu-' . bin2hex(random_bytes(6)) . '.json';

        $handle = @fopen($tmp, 'wb');
        if ($handle === false) {
            throw MenuEngineException::storage('cannot create the temp file');
        }
        $ok = fwrite($handle, $json) === strlen($json) && fflush($handle) && fsync($handle);
        fclose($handle);

        if (!$ok || !@rename($tmp, $this->file)) {
            @unlink($tmp);
            throw MenuEngineException::storage('cannot replace the menu file');
        }
    }
}
