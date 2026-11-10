
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';


const API_URL = 'http://192.168.0.10:3000';


export default function Login() {

  const [tipoUsuario, setTipoUsuario] = useState<'estudiante' | 'nutriologa'>('estudiante');
  const [expediente, setExpediente] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);


const iniciarSesion = async () => {
  const identificador = tipoUsuario === 'estudiante'
    ? expediente.trim()
    : correo.trim();

  if (!identificador || !contrasena.trim()) {
    Alert.alert(
      'Campos incompletos',
      tipoUsuario === 'estudiante'
        ? 'Ingresa tu expediente y contraseña.'
        : 'Ingresa tu correo y contraseña.'
    );
    return;
  }

  console.log('TIPO DE USUARIO:', tipoUsuario);

  setCargando(true);

  try {
    console.log('ENVIANDO LOGIN:', {
      tipoUsuario,
      expediente: tipoUsuario === 'estudiante' ? expediente : undefined,
      correo: tipoUsuario === 'nutriologa' ? correo : undefined,
    });

    const respuesta = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...(tipoUsuario === 'estudiante'
          ? { expediente: expediente.trim() }
          : { correo: correo.trim().toLowerCase() }),
        contrasena,
      }),
    });

    const datos = await respuesta.json();

    console.log('RESPUESTA DEL SERVIDOR:', datos);
    

    if (!respuesta.ok) {
      Alert.alert('Error', datos.mensaje);
      return;
    }

    await AsyncStorage.setItem(
      'usuario',
      JSON.stringify(datos.usuario)
    );
// Guardar los datos del usuario
await AsyncStorage.setItem(
  'usuario',
  JSON.stringify(datos.usuario)
);

// Mensaje de bienvenida según la plataforma
if (Platform.OS === 'web') {
  window.alert(`¡Bienvenid@!\n${datos.mensaje}`);

  // Redirigir después de aceptar
  if (datos.usuario.rol === 'nutriologa') {
    router.replace('/nutriologa');
  } else {
    router.replace('/recordatorios');
  }

} else {
  Alert.alert('¡Bienvenid@!', datos.mensaje, [
    {
      text: 'Continuar',
      onPress: () => {
        if (datos.usuario.rol === 'nutriologa') {
          router.replace('/nutriologa');
        } else {
          router.replace('/recordatorios');
        }
      },
    },
  ]);
}

  } catch (error) {
    console.log('ERROR LOGIN:', error);

    Alert.alert(
      'Error de conexión',
      'No fue posible comunicarse con el servidor.'
    );

  } finally {
    setCargando(false);
  }
};


  return (
    <View style={styles.container}>

      {/* Regresar */}
      <TouchableOpacity
        style={styles.regresar}
        onPress={() => router.back()}
      >
        <Text style={styles.flecha}>‹</Text>
        <Text style={styles.textoRegresar}>Regresar</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.titulo}>
        ¡Bienvenido de nuevo!
      </Text>

      <Text style={styles.subtitulo}>
        Inicia sesión en tu cuenta de TroyaFit
      </Text>

      {/* Selección de usuario */}
      <View style={styles.selector}>

        <TouchableOpacity
          style={[
            styles.opcion,
            tipoUsuario === 'estudiante' && styles.opcionActiva,
          ]}
          onPress={() => setTipoUsuario('estudiante')}
        >
          <Text
            style={[
              styles.textoOpcion,
              tipoUsuario === 'estudiante' && styles.textoOpcionActivo,
            ]}
          >
            Estudiante
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.opcion,
            tipoUsuario === 'nutriologa' && styles.opcionActiva,
          ]}
          onPress={() => setTipoUsuario('nutriologa')}
        >
          <Text
            style={[
              styles.textoOpcion,
              tipoUsuario === 'nutriologa' && styles.textoOpcionActivo,
            ]}
          >
            Nutrióloga
          </Text>
        </TouchableOpacity>

      </View>

      {/* Tarjeta */}
      <View style={styles.tarjeta}>

        {/* Identificador */}
        <Text style={styles.etiqueta}>
          {tipoUsuario === 'estudiante'
            ? 'Expediente UAQ'
            : 'Correo electrónico'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder={
            tipoUsuario === 'estudiante'
              ? 'Ingresa tu expediente'
              : 'Ingresa tu correo'
          }
          placeholderTextColor="#999999"
          keyboardType={
            tipoUsuario === 'estudiante'
              ? 'numeric'
              : 'email-address'
          }
          autoCapitalize="none"
          value={tipoUsuario === 'estudiante' ? expediente : correo}
          onChangeText={
            tipoUsuario === 'estudiante'
              ? setExpediente
              : setCorreo
          }
        />

        <Text style={styles.ayuda}>
          {tipoUsuario === 'estudiante'
            ? 'Tu expediente es tu identificador como estudiante UAQ.'
            : 'Ingresa el correo asignado a la nutrióloga.'}
        </Text>

        {/* Contraseña */}
        <Text style={styles.etiqueta}>
          Contraseña
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#999999"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
        />

        {/* Recuperar contraseña */}
        <TouchableOpacity style={styles.recuperar}>
          <Text style={styles.textoRecuperar}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

      </View>

      {/* Botón */}
      <TouchableOpacity
        style={[
          styles.boton,
          cargando && styles.botonDeshabilitado,
        ]}
        onPress={iniciarSesion}
        disabled={cargando}
      >
        <Text style={styles.textoBoton}>
          {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Text>
      </TouchableOpacity>








      {/* Registro: solamente estudiantes */}
      {tipoUsuario === 'estudiante' && (
        <View style={styles.registro}>
          <Text style={styles.textoPregunta}>
            ¿Aún no tienes una cuenta?
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/registro')}
          >
            <Text style={styles.crearCuenta}>
              Crear una cuenta
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f1e8cf',
    paddingHorizontal: 25,
    paddingTop: 45,
  },

  regresar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
  },

  flecha: {
    fontSize: 35,
    color: '#1F416A',
    marginRight: 5,
    marginTop: -4,
  },

  textoRegresar: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F416A',
  },

  titulo: {
    fontSize: 29,
    fontWeight: '800',
    color: '#1F416A',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 20,
  },

  selector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 5,
    marginBottom: 18,
  },

  opcion: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  opcionActiva: {
    backgroundColor: '#4089C0',
  },

  textoOpcion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F416A',
  },

  textoOpcionActivo: {
    color: '#FFFFFF',
  },

  tarjeta: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 8,

    elevation: 4,
  },

  etiqueta: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 8,
  },

  ayuda: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 22,
    lineHeight: 16,
  },

  recuperar: {
    alignItems: 'flex-end',
    marginTop: 2,
  },

  textoRecuperar: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F416A',
  },

  boton: {
    width: '100%',
    backgroundColor: '#4089C0',
    paddingVertical: 16,
    borderRadius: 28,
    marginTop: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,

    elevation: 4,
  },

  botonDeshabilitado: {
    opacity: 0.6,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },

  registro: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  textoPregunta: {
    fontSize: 13,
    color: '#666666',
    marginRight: 5,
  },

  crearCuenta: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F416A',
  },

});




