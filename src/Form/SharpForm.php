<?php

namespace Code16\Sharp\Form;

use Code16\Sharp\Form\Fields\SharpFormField;
use Code16\Sharp\Form\Layout\FormLayoutColumn;
use Code16\Sharp\Form\Layout\FormLayoutTab;
use Illuminate\Database\Eloquent\Model;

abstract class SharpForm
{
    /**
     * @var array
     */
    protected $fields = [];

    /**
     * @var array
     */
    protected $tabs = [];

    /**
     * @var bool
     */
    protected $formBuilt = false;

    /**
     * @var bool
     */
    protected $layoutBuilt = false;

    /**
     * Get the SharpFormField array representation.
     *
     * @return array
     */
    function fields(): array
    {
        if(!$this->formBuilt) {
            $this->buildFormFields();
            $this->formBuilt = true;
        }

        return collect($this->fields)->map(function($field) {
            return $field->toArray();
        })->all();
    }

    /**
     * Return the form fields layout.
     *
     * @return array
     */
    function formLayout(): array
    {
        if(!$this->layoutBuilt) {
            $this->buildFormLayout();
            $this->layoutBuilt = true;
        }

        return collect($this->tabs)->map(function($tab) {
            return $tab->toArray();
        })->all();
    }

    /**
     * Return the entity instance, as an array.
     *
     * @param $id
     * @return array
     */
    function instance($id): array
    {
        return collect($this->find($id))
            // Filter model attributes on actual form fields
            ->only($this->getFieldKeys())
            ->all();
    }

    /**
     * Return the key attribute of all fields defined in the form.
     *
     * @return array
     */
    function getFieldKeys(): array
    {
        return collect($this->fields())
            ->pluck("key")
            ->all();
    }

    /**
     * @param string $key
     * @return array
     */
    function findFieldByKey(string $key)
    {
        return collect($this->fields())
            ->where("key", $key)
            ->first();
    }

    /**
     * Add a field.
     *
     * @param SharpFormField $field
     */
    protected function addField(SharpFormField $field)
    {
        $this->fields[] = $field;
        $this->formBuilt = false;
    }

    /**
     * @param string $label
     * @return FormLayoutTab
     */
    protected function addTab(string $label): FormLayoutTab
    {
        $this->layoutBuilt = false;

        return $this->addTabLayout(new FormLayoutTab($label));
    }

    /**
     * @param int $size
     * @return FormLayoutColumn
     */
    protected function addColumn(int $size): FormLayoutColumn
    {
        $this->layoutBuilt = false;
        $tab = $this->addTab("one");

        return $tab->addColumn($size);
    }

    /**
     * @param FormLayoutTab $tab
     * @return FormLayoutTab
     */
    private function addTabLayout(FormLayoutTab $tab): FormLayoutTab
    {
        $this->tabs[] = $tab;

        return $tab;
    }

    /**
     * @param array $data
     * @return bool
     */
    public function store(array $data): bool
    {
        return $this->update(null, $data);
    }

    /**
     * Retrieve a Model for the form and pack all its data as JSON.
     *
     * @param $id
     * @return array
     */
    abstract function find($id): array;

    /**
     * @param $id
     * @param array $data
     * @return bool
     */
    abstract function update($id, array $data): bool;

    /**
     * @param $id
     * @return bool
     */
    abstract function delete($id): bool;

    /**
     * Build form fields using ->addField()
     *
     * @return void
     */
    abstract function buildFormFields();

    /**
     * Build form layout using ->addTab() or ->addColumn()
     *
     * @return void
     */
    abstract function buildFormLayout();
}