/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

/*
 ** TODO: refactor to make this agnostic for both blocks and group fields
 */
import styled from 'styled-components'
import * as React from 'react'
import {
  FieldsBuilder,
  Modal,
  ModalPopup,
  ModalHeader,
  ModalBody,
  ModalActions,
} from 'tinacms'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Button, IconButton } from '@tinacms/styles'
import { SettingsIcon } from '@tinacms/icons'
import { Field } from 'tinacms'

import { InlineFieldContext } from '../inline-field-context'
import { useInlineForm } from '../inline-form'
import { FormPortalProvider } from '@tinacms/react-forms'

export function InlineGroupSettings() {
  const [open, setOpen] = React.useState(false)
  const { name, fields } = React.useContext(InlineFieldContext)

  const noExtraFields = !(fields && fields.length)

  if (noExtraFields) {
    return null
  }
  return (
    <>
      <IconButton primary onClick={() => setOpen(p => !p)}>
        <SettingsIcon />
      </IconButton>
      {open && (
        <SettingsModal
          fields={fields}
          name={name}
          close={() => setOpen(false)}
        />
      )}
    </>
  )
}

interface SettingsModalProps {
  fields: Field[]
  name?: string
  close(): void
}

function SettingsModal({ fields, close, name }: SettingsModalProps) {
  const { form } = useInlineForm()

  let formFields = fields

  if (name) {
    formFields = fields.map((field: any) => ({
      ...field,
      name: `${name}.${field.name}`,
    }))
  }
  const moveArrayItem = React.useCallback(
    (result: DropResult) => {
      if (!result.destination || !form) return
      const name = result.type
      form.mutators.move(name, result.source.index, result.destination.index)
    },
    [form]
  )
  return (
    <Modal>
      <ModalPopup>
        <ModalHeader close={close}>Settings</ModalHeader>
        <ModalBody>
          <DragDropContext onDragEnd={moveArrayItem}>
            <Wrapper>
              <FormPortalProvider>
                <FieldsBuilder form={form} fields={formFields} />
              </FormPortalProvider>
            </Wrapper>
          </DragDropContext>
        </ModalBody>
        <ModalActions>
          <Button onClick={close}>Cancel</Button>
        </ModalActions>
      </ModalPopup>
    </Modal>
  )
}

const Wrapper = styled.div`
  display: block;
  margin: 0 auto;
  width: 100%;
`
