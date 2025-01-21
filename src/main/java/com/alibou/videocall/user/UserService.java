package com.alibou.videocall.user;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

import jakarta.websocket.server.ServerEndpoint;

@Service
public class UserService {

    private static final List<User> User_List = new ArrayList<>();
    
    public void register(User user){
        user.setStatus("Online");
        User_List.add(user);
    }

    public User login(User user){
        var userIndex = IntStream.range(0, User_List.size()).filter(i -> User_List.get(i).getEmail().equals(user.getEmail())).findAny().orElseThrow(() -> new RuntimeException("User not found"));
        var cUser = User_List.get(userIndex);
        if(!cUser.getPassword().equals((user.getPassword()))){
            throw new RuntimeException("Password is incorrect");
        }
        cUser.setStatus("Online");
        return cUser;
    }

    public void logout(String email){
        var userIndex = IntStream.range(0, User_List.size()).filter(i -> User_List.get(i).getEmail().equals(email)).findAny().orElseThrow(() -> new RuntimeException("User not found"));
        User_List.get(userIndex).setStatus("Offline");
    }

    public List<User> findAll(){
        return User_List;
    }
}
