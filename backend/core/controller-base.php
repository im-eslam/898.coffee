<?php
abstract class ControllerBase {
    public function __construct(protected array $config) {}

    protected function DbContext(): PDO {
        return DbContext::connect($this->config['db']);
    }
}