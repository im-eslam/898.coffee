<?php

interface MenuStore
{
    public function read(): string;
    public function replace(string $ifMatch, string $json): void;
}

final class MenuDbStore implements MenuStore
{
    public function __construct(
        private readonly PDO $db,
        private readonly string $seedFile,
    ) {}

    public function read(): string
    {
        try {
            $this->db->exec(
                'CREATE TABLE IF NOT EXISTS menu_document (
                    id SMALLINT PRIMARY KEY,
                    document TEXT NOT NULL,
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )'
            );
            $statement = $this->db->prepare('SELECT document FROM menu_document WHERE id = 1');
            $statement->execute();
            $document = $statement->fetchColumn();
            if (is_string($document)) return $document;

            $seed = @file_get_contents($this->seedFile);
            if ($seed === false) {
                throw MenuEngineException::storage('cannot read the seeded menu');
            }
            $this->replace('', $seed);
            return $seed;
        } catch (PDOException $error) {
            throw MenuEngineException::storage('cannot read the menu database');
        }
    }

    public function replace(string $ifMatch, string $json): void
    {
        try {
            $statement = $this->db->prepare(
                'INSERT INTO menu_document (id, document, updated_at)
                 VALUES (1, :document, NOW())
                 ON CONFLICT (id) DO UPDATE
                 SET document = EXCLUDED.document, updated_at = NOW()'
            );
            $statement->execute(['document' => $json]);
        } catch (PDOException $error) {
            throw MenuEngineException::storage('cannot write the menu database');
        }
    }
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
        $this->writeAtomic($json);
    }

    private function writeAtomic(string $json): void
    {
        $tmp = dirname($this->file) . '/.menu-' . bin2hex(random_bytes(6)) . '.json';

        $handle = @fopen($tmp, 'wb');
        if ($handle === false) {
            throw MenuEngineException::storage('cannot create the temp file');
        }
        $ok = fwrite($handle, $json) === strlen($json) && fflush($handle);
        if ($ok && function_exists('fsync')) {
            $ok = fsync($handle);
        }
        fclose($handle);


        
        if (!$ok) {
            @unlink($tmp);
            throw MenuEngineException::storage('cannot replace the menu file');
        }
        if (!@rename($tmp, $this->file)) {
            @unlink($tmp);
            if (@file_put_contents($this->file, $json) !== strlen($json)) {
                throw MenuEngineException::storage('cannot replace the menu file');
            }
        }
    }
}
