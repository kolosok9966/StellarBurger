import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import {
  removeSelectedIngredient,
  reorderIngredients,
} from '@/services/burger-constructor/reducer';
import { decrementCount } from '@/services/ingredients/reducer';
import { DND_TYPES } from '@/utils/dnd-types';
import { IngredientType } from '@/utils/types';

import styles from './constructor-ingredient.module.css';

export const ConstructorIngredient = ({ ingredient, index }) => {
  ConstructorIngredient.propTypes = {
    ingredient: IngredientType.isRequired,
    index: PropTypes.number.isRequired,
  };

  const dispatch = useDispatch();
  const ref = useRef(null);

  const handleDeleteSelectIngredient = (ingredient) => {
    dispatch(removeSelectedIngredient(ingredient));
    dispatch(decrementCount(ingredient));
  };

  const [, drop] = useDrop({
    accept: DND_TYPES.INGREDIENT,
    hover(item, monitor) {
      if (!ref.current) return;
      if (item.index == null) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      dispatch(reorderIngredients({ fromIndex: dragIndex, toIndex: hoverIndex }));
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, dragRef] = useDrag({
    type: DND_TYPES.INGREDIENT,
    item: {
      ...ingredient,
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(drop(ref));

  return (
    <div ref={ref} className={styles.item} style={{ opacity: isDragging ? 0 : 1 }}>
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => handleDeleteSelectIngredient(ingredient)}
      />
    </div>
  );
};
