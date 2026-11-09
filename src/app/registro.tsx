
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { useState } from 'react';

const API_URL = 'http://148.220.213.109:3000';

export default function Registro() {

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [expediente, setExpediente] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  const registrarUsuario = async () => {

    if (
      !nombreCompleto.trim() ||
      !expediente.trim() ||
      !correo.trim() ||
      !contrasena ||
      !confirmarContrasena
    ) {
      Alert.alert('Campos incompletos', 'Completa todos los campos.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      Alert.alert('Contraseñas diferentes', 'Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);

    try {

      const respuesta = await fetch(`${API_URL}/api/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreCompleto,
          expediente,
          correo,
          contrasena,
          confirmarContrasena,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        Alert.alert('No se pudo crear la cuenta', datos.mensaje);
        return;
      }

      Alert.alert(
        '¡Registro exitoso!',
        'Tu cuenta de TroyaFit fue creada correctamente.',
        [
          {
            text: 'Iniciar sesión',
            onPress: () => router.replace('/login'),
          },
        ]
      );

    } catch (error) {

      console.log('Error de registro:', error);

      Alert.alert(
        'Error de conexión',
        'No fue posible comunicarse con el servidor. Intenta nuevamente.'
      );

    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <TouchableOpacity
        style={styles.regresar}
        onPress={() => router.back()}
      >
        <Text style={styles.flecha}>‹</Text>
        <Text style={styles.textoRegresar}>Regresar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>
        Crear una cuenta
      </Text>

      <Text style={styles.subtitulo}>
        Únete a la comunidad de TroyaFit
      </Text>

      <View style={styles.formulario}>

        <Text style={styles.etiqueta}>
          Nombre completo
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Escribe tu nombre"
          placeholderTextColor="#999999"
          value={nombreCompleto}
          onChangeText={setNombreCompleto}
        />

        <Text style={styles.etiqueta}>
          Expediente
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Expediente"
          placeholderTextColor="#999999"
          value={expediente}
          onChangeText={setExpediente}
          autoCapitalize="none"
        />

        <Text style={styles.etiqueta}>
          Correo electrónico
        </Text>

        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          placeholderTextColor="#999999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.etiqueta}>
          Contraseña
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Crea una contraseña"
          placeholderTextColor="#999999"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
        />

        <Text style={styles.etiqueta}>
          Confirmar contraseña
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          placeholderTextColor="#999999"
          secureTextEntry
          value={confirmarContrasena}
          onChangeText={setConfirmarContrasena}
        />

      </View>

      <TouchableOpacity
        style={styles.boton}
        onPress={registrarUsuario}
        disabled={cargando}
      >
        <Text style={styles.textoBoton}>
          {cargando ? 'Creando cuenta...' : 'Crear mi cuenta'}
        </Text>
      </TouchableOpacity>

      <View style={styles.iniciar}>
        <Text style={styles.textoPregunta}>
          ¿Ya tienes una cuenta?
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/login')}
        >
          <Text style={styles.iniciarSesion}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: '#f1e8cf',
    paddingHorizontal: 25,
    paddingTop: 45,
    paddingBottom: 30,
  },

  regresar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
    fontSize: 30,
    fontWeight: '800',
    color: '#1F416A',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 30,
  },

  formulario: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
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
    height: 50,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333333',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  boton: {
    width: '100%',
    backgroundColor: '#4089C0',
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },

  iniciar: {
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

  iniciarSesion: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F416A',
  },

});
