import { useForm } from 'react-hook-form';

export function UserForm({ mode, defaultValues, onSubmit, submitText }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues });

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <label>
        Nombre
        <input
          {...register('name', { required: 'El nombre es obligatorio.', minLength: 2 })}
          autoComplete="name"
        />
        {errors.name && <small>{errors.name.message || 'Minimo 2 caracteres.'}</small>}
      </label>

      <label>
        Email
        <input
          type="email"
          {...register('email', { required: 'El email es obligatorio.' })}
          autoComplete="email"
        />
        {errors.email && <small>{errors.email.message}</small>}
      </label>

      {mode !== 'profile' && (
        <label>
          Password
          <input
            type="password"
            {...register('password', {
              required: 'La password es obligatoria.',
              minLength: { value: 6, message: 'Minimo 6 caracteres.' }
            })}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {errors.password && <small>{errors.password.message}</small>}
        </label>
      )}

      <button className="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Procesando...' : submitText}
      </button>
    </form>
  );
}
