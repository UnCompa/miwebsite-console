import { EllipsisVertical, Trash } from 'lucide-react';
import React from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoEye } from 'react-icons/io5';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Dropdown from '../../ui/Dropdown';

interface CardProps<T> {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onView: (item: T) => void;
  renderContent: (item: T) => React.ReactNode; // Función para renderizar contenido personalizado
}

const ViewDataCard = <T,>({ item, onEdit, onDelete, onView, renderContent }: CardProps<T>) => {
  return (
    <Card className=' rounded-lg p-4'>
      <Card.Body>
        {renderContent(item)} {/* Renderiza contenido personalizado */}
      </Card.Body>
      <Card.Footer className='flex justify-center pt-2 flex-wrap gap-2'>
        <Button fullWidth={false} onClick={() => onView(item)} theme='neutral' icon={IoEye}>Ver</Button>
        <Button fullWidth={false} onClick={() => onEdit(item)} theme='primary' icon={FaRegEdit}>Editar</Button>
        <Dropdown
          icon={EllipsisVertical}
          theme="neutral"
          direction="down"  // o "up", "left", "right"
          items={[
            {
              children: "Eliminar",
              icon: Trash,  // Ícono opcional para el elemento
              onClick: () => onDelete(item),
              className: 'text-red-500'
            }
          ]}
        />
      </Card.Footer>
    </Card>
  );
}

export default ViewDataCard;